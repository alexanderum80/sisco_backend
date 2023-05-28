import { LogsService } from './../logs/logs.service';
import { ContaConexionesEntity } from './../conta-conexiones/conta-conexiones.entity';
import { toNumber } from 'lodash';
import { UsuariosEntity } from './../usuarios/usuarios.entity';
import { ETipoClasificadorCuenta } from './../clasificador-cuenta/clasificador-cuenta.model';
import { ClasificadorCuentaService } from './../clasificador-cuenta/clasificador-cuenta.service';
import { ContaConexionesService } from './../conta-conexiones/conta-conexiones.service';
import { Injectable } from '@nestjs/common';
import {
  queryUltimoPeriodo,
  queryAsientoRodas,
  queryRangoAsientosMesRodas,
  querySaldosAcumuladosRodas,
  queryClasificadorCuentasRodas,
  ConciliaContabilidadQueryResponse,
  queryReporteConsultas,
  queryReporteExpresiones,
  queryReporteValores,
  queryUpdateCriterioClasificadorRodas,
  queryUpdateClasificadorRodas,
  queryObligacionesRodas,
  IConciliaReporteConsulta,
  IConciliaReporteExpresiones,
  IConciliaReporteValores,
  IConciliaCuadreSistemas,
  IConciliaInformacionContabilidad,
  IChequeoCentroVsConsolidado,
} from './concilia-conta.model';
import { ConciliaContaInput, IniciarSaldosInput, ChequearCentrosInput } from './dto/concilia-conta.input';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ConciliaContaService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private _contaConexionesService: ContaConexionesService,
    private _clasificadorCuentaSvc: ClasificadorCuentaService,
    private _logsSvc: LogsService,
  ) {}

  async conciliaContabilidad(user: UsuariosEntity, conciliaContaInput: ConciliaContaInput): Promise<ConciliaContabilidadQueryResponse> {
    try {
      const { IdDivision } = user;
      const { idCentro, periodo, annio, tipoCentro, tipoEntidad } = conciliaContaInput;
      const consolidado = tipoCentro === 2;

      // verificar si se ha definido la conexión al Rodas
      const _conexionConta = await this._contaConexionesService.findByIdUnidad(idCentro, tipoCentro === 2).catch(err => {
        throw new Error(err);
      });

      // conecto al Conta del Centro
      const _contaConexionCentro: DataSource = await this._contaConexionesService.conexionRodas(_conexionConta);

      // importar y chequear el clasificador de cuentas
      const _chequeaClasifRes = await this._importarClasificador(idCentro, tipoCentro, annio, consolidado, periodo, _contaConexionCentro).catch(err => {
        throw new Error(err);
      });

      if (_chequeaClasifRes.length) {
        // cierro la conexión al Rodas del Centro
        if (_contaConexionCentro && _contaConexionCentro.isInitialized) _contaConexionCentro.destroy();

        return {
          ReporteClasificador: _chequeaClasifRes,
          ReporteConsultas: [],
          ReporteExpresiones: [],
          ReporteValores: [],
          CuadreSistemas: [],
          Informacion: [],
        };
      }

      // importar los comprobantes, asientos, etc.
      await this.importarContabilidad(idCentro, annio, periodo, consolidado, _contaConexionCentro);

      // calcular la conciliación
      await this._calculaConciliacion(idCentro, tipoCentro, annio, periodo, tipoEntidad, IdDivision).catch(err => {
        throw new Error(err);
      });

      // devuelvo el resultado de la conciliación
      return new Promise<ConciliaContabilidadQueryResponse>((resolve, reject) => {
        this._getReportesConciliacion(idCentro, consolidado, annio, periodo, IdDivision)
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    } catch (err: any) {
      return Promise.reject(err.message || err);
    }
  }

  async _importarClasificador(idUnidad: number, tipoCentro: number, annio: number, cons: boolean, periodo: number, contaConexion: DataSource): Promise<any> {
    try {
      // inserto el clasificador del Rodas
      const _clasifCuentas = await contaConexion.query(queryClasificadorCuentasRodas.replace(/@anno/gi, annio.toString())).catch(err => {
        throw new Error(err.message || err);
      });

      // let _clasifCuentasXML = this._xmlJsService.jsonToXML('Cuentas', {});

      if (_clasifCuentas.length) {
        //   _clasifCuentasXML = this._xmlJsService.jsonToXML('Cuentas', _clasifCuentas);

        let tipoClasif = '';
        switch (tipoCentro) {
          case 0:
            tipoClasif = '2';
            break;
          case 1:
            tipoClasif = '3';
            break;
          case 2:
            tipoClasif = '1';
            break;
        }

        return new Promise<any>((resolve, reject) => {
          this.dataSource
            .query(`select * from Conta_Import_Clasif_Cuenta ($1::json, $2::int, $3::int, $4::bool, $5::int, $6::int)`, [
              JSON.stringify(_clasifCuentas),
              idUnidad,
              tipoClasif,
              cons,
              annio,
              periodo,
            ])
            .then(result => {
              resolve(result);
            })
            .catch(err => {
              reject(err.message ? err.message : err);
            });
        });
      } else {
        throw new Error('No existe Clasificador de Cuentas para el Centro. <br>No se puede realizar la Conciliación.');
      }
    } catch (err: any) {
      if (contaConexion && contaConexion.isInitialized) contaConexion.destroy();

      throw new Error(err.message || err);
    }
  }

  async importarContabilidad(idUnidad: number, annio: number, periodo: number, cons: boolean, contaConexion: DataSource): Promise<void> {
    try {
      // obtener el ultimo periodo importado en el SISCO
      const _queryUltimoPeriodo = queryUltimoPeriodo
        .replace(/@Anio/g, annio.toString())
        .replace(/@Cons/g, cons.toString())
        .replace(/@Centro/g, idUnidad.toString());
      const _ultimoPeriodoRes = await this.dataSource.query(_queryUltimoPeriodo).then(result => {
        return result;
      });

      let _ultimoPeriodo = -1;
      if (_ultimoPeriodoRes.length) {
        _ultimoPeriodo = toNumber(_ultimoPeriodoRes[0].periodo);
      }

      // chequear los datos adulterados
      await this._chequeaDatosAdulterados(idUnidad, contaConexion);

      // arregla asientos
      await this._arreglaAsientosRodas(contaConexion).catch(err => {
        throw new Error(err);
      });

      if (_ultimoPeriodo > 0) {
        // chequear saldos acumulados hasta el periodo anterior
        await this._chequearSaldoAcumulados(idUnidad, annio, _ultimoPeriodo, cons, contaConexion);
      }

      const _periodoInicial = _ultimoPeriodo < periodo ? _ultimoPeriodo : periodo;

      for (let per = _periodoInicial; per <= periodo; per++) {
        // importar los asientos
        await this._importarAsientos(idUnidad, annio, per, cons, contaConexion);

        // importar las obligaciones
        await this._importarObligaciones(idUnidad, annio, per, cons, contaConexion);
      }

      // cierro la conexión al Rodas del Centro
      if (contaConexion && contaConexion.isInitialized) contaConexion.destroy();

      await this._updateFechaActualizacion(idUnidad, cons).catch(err => {
        throw new Error(err.message || err);
      });
    } catch (err: any) {
      if (contaConexion && contaConexion.isInitialized) contaConexion.destroy();

      throw new Error(err.message || err);
    }
  }

  private async _chequeaDatosAdulterados(idUnidad: number, conexionRodas: DataSource): Promise<void> {
    const _queryAsientos = queryRangoAsientosMesRodas;

    await conexionRodas
      .query(_queryAsientos)
      .then(result => {
        let _asientoAnt = 0;
        let _asientoIni = 0;

        result.forEach((asiento: any) => {
          _asientoIni = toNumber(asiento.ini);

          if (_asientoIni < _asientoAnt) {
            const _periodo = toNumber(asiento.periodo) - 1;
            // const _unidad = _unidadInfo.IdUnidad + '-' + _unidadInfo.Nombre;
            // const _division = _unidadInfo.IdDivision + '-' + _unidadInfo.Division;

            // let _msg = '';
            let _error;

            if (_periodo < 0) {
              // _msg = `Existe una(s) línea(s) en blanco en los Asientos del Centro ${ _unidad },
              //     perteneciente a la División ${ _division }.`;
              _error = `Existe una(s) línea(s) en blanco en los Asientos del Centro`;
            } else {
              // _msg = `Datos del Rodas adulterados en el período ${ _periodo } del Centro ${ _unidad },
              //     pertenciente a la División ${ _division }.`;
              _error = `Se adulteraron los datos del sistema Rodas.
                            Restaure los datos contables a partir del período ${_periodo}, reconstruya lo que le falta de este y trabaje en el período que le sigue, para después enviar la información al nivel superior.
                            La causa es uno o más comprobantes hechos en el período ${_periodo} después de haber trabajado el período ${_periodo + 1}`;
            }

            // enviar correo

            throw new Error(_error);
          }

          _asientoAnt = toNumber(asiento.Fin);
        });
      })
      .catch(err => {
        throw new Error(err.message || err);
      });
  }

  private async _chequearSaldoAcumulados(idUnidad: number, annio: number, periodo: number, cons: boolean, conexionRodas: DataSource): Promise<void> {
    const _querySaldosAcumRodas = querySaldosAcumuladosRodas.replace(/@anno/g, annio.toString()).replace(/@periodo/g, periodo.toString());

    const _querySaldoAcumRodasRes = await conexionRodas
      .query(_querySaldosAcumRodas)
      .then(result => {
        return { data: result };
      })
      .catch(err => {
        throw new Error(err.message || err);
      });

    let _saldoDebito = 0;
    let _saldoCredito = 0;
    if (_querySaldoAcumRodasRes.data.length > 0) {
      _saldoDebito = _querySaldoAcumRodasRes.data[0].debito;
      _saldoCredito = _querySaldoAcumRodasRes.data[0].credito;
    }

    await this.dataSource
      .query('SELECT * from Conta_Saldo_Acumulado ($1::int, $2::bool, $3::int, $4::int, $5::numeric, $6::numeric)', [idUnidad, cons, annio, periodo, _saldoDebito, _saldoCredito])
      .then(result => {
        if (toNumber(result[0].dif_debito) !== 0 || toNumber(result[0].dif_credito) !== 0) {
          const _error = `Los Saldos Acumulados entre el Rodas y SISCO hasta el período ${
            periodo - 1
          } no coinciden.<br>Concilie el período anterior, y después concilie el actual.<br>No se continuará con la Conciliación.`;

          throw new Error(_error);
        }
      })
      .catch(err => {
        throw new Error(err.message || err);
      });
  }

  private async _importarAsientos(idUnidad: number, annio: number, periodo: number, cons: boolean, rodasConexion: DataSource): Promise<void> {
    const _queryAsientos = queryAsientoRodas.replace(/@anno/g, annio.toString()).replace(/@periodo/g, periodo.toString());

    const _asientos = await rodasConexion
      .query(_queryAsientos)
      .then(result => {
        return result;
      })
      .catch(err => {
        throw new Error(err.message || err);
      });

    if (_asientos.length) {
      // const _asientos = this._xmlJsService.jsonToXML('Asiento', _queryAsientosRes);

      await this.dataSource
        .query(`CALL Conta_Import_Asiento ($1::json, $2::int, $3::bool, $4::int, $5::int)`, [JSON.stringify(_asientos), idUnidad, cons, annio, periodo])
        .catch(err => {
          throw new Error(err.message || err);
        });
    }
  }

  private async _importarObligaciones(idUnidad: number, annio: number, periodo: number, cons: boolean, rodasConexion: DataSource): Promise<void> {
    const _queryAsientos = queryObligacionesRodas.replace(/@anno/g, annio.toString()).replace(/@periodo/g, periodo.toString());

    const _obl = await rodasConexion
      .query(_queryAsientos)
      .then(result => {
        return result;
      })
      .catch(err => {
        throw new Error(err.message || err);
      });

    if (_obl.length) {
      // const _obl = this._xmlJsService.jsonToXML('Obligaciones', _queryAsientosRes);

      await this.dataSource
        .query(`CALL Conta_Import_Obligaciones ($1::json, $2::int, $3::bool, $4::int, $5::int)`, [JSON.stringify(_obl), idUnidad, cons, annio, periodo])
        .catch(err => {
          throw new Error(err.message || err);
        });
    }
  }

  private async _updateFechaActualizacion(idUnidad: number, cons: boolean): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .update(ContaConexionesEntity)
      .set({ FechaActualizacion: new Date() })
      .where('IdUnidad = :idUnidad', { idUnidad: idUnidad })
      .andWhere('Consolidado = :cons', { cons: cons })
      .execute()
      .catch(err => {
        throw new Error(err.message || err);
      });
  }

  private async _calculaConciliacion(idUnidad: number, tipoClasificador: number, anio: number, periodo: number, tipoEntidad: number, idDivision: number): Promise<void> {
    const cons = tipoClasificador === 2 ? true : false;

    switch (tipoClasificador) {
      case 0:
        tipoClasificador = 2;
        break;
      case 1:
        tipoClasificador = 3;
        break;
      case 2:
        tipoClasificador = 1;
        tipoEntidad = 1;
        break;
    }

    await this.dataSource
      .query(`CALL Conta_Calcula_Conciliacion ($1::int, $2::int, $3::int, $4::bool, $5::int, $6::int, $7::int)`, [
        idUnidad,
        tipoClasificador,
        tipoEntidad,
        cons,
        anio,
        periodo,
        idDivision,
      ])
      .catch(err => {
        throw new Error(err.message || err);
      });
  }

  private async _getReportesConciliacion(idCentro: number, consolidado: boolean, annio: number, periodo: number, idDivision: number): Promise<ConciliaContabilidadQueryResponse> {
    // devuelvo el resultado de la conciliación
    const _queryReporteConsultas = this._reporteConsultas(idCentro, consolidado, annio, periodo, 1);
    const _queryReporteExpresiones = this._reporteExpresiones(idCentro, consolidado, annio, periodo);
    const _queryReporteValores = this._reporteValores(idCentro, consolidado, annio, periodo, idDivision);
    const _queryReporteCuadreSistemas = this._reporteCuadreSistemas(idCentro, consolidado, annio, periodo);
    const _queryReporteInformacion = this._reporteInformacionContabilidad(idCentro, consolidado, annio, periodo);

    return new Promise<ConciliaContabilidadQueryResponse>((resolve, reject) => {
      Promise.all([_queryReporteConsultas, _queryReporteExpresiones, _queryReporteValores, _queryReporteCuadreSistemas, _queryReporteInformacion])
        .then(result => {
          resolve({
            ReporteClasificador: [],
            ReporteConsultas: result[0],
            ReporteExpresiones: result[1],
            ReporteValores: result[2],
            CuadreSistemas: result[3],
            Informacion: result[4],
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  private async _reporteConsultas(idUnidad: number, cons: boolean, annio: number, periodo: number, idConsulta: number): Promise<IConciliaReporteConsulta[]> {
    const _query = queryReporteConsultas
      .replace(/@Centro/g, idUnidad.toString())
      .replace(/@Consolidado/g, cons ? 'true' : 'false')
      .replace(/@Anio/g, annio.toString())
      .replace(/@Periodo/g, periodo.toString())
      .replace(/@IdConsulta/g, idConsulta.toString());

    return new Promise<IConciliaReporteConsulta[]>((resolve, reject) => {
      this.dataSource
        .query(_query)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err.message || err);
        });
    });
  }

  private async _reporteExpresiones(idUnidad: number, cons: boolean, annio: number, periodo: number): Promise<IConciliaReporteExpresiones[]> {
    const _query = queryReporteExpresiones
      .replace(/@Centro/g, idUnidad.toString())
      .replace(/@Consolidado/g, cons ? 'true' : 'false')
      .replace(/@Anio/g, annio.toString())
      .replace(/@Periodo/g, periodo.toString());

    return new Promise<IConciliaReporteExpresiones[]>((resolve, reject) => {
      this.dataSource
        .query(_query)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err.message || err);
        });
    });
  }

  private async _reporteValores(idUnidad: number, cons: boolean, annio: number, periodo: number, idDivision: number): Promise<IConciliaReporteValores[]> {
    const _query = queryReporteValores
      .replace(/@Centro/g, idUnidad.toString())
      .replace(/@Consolidado/g, cons ? 'true' : 'false')
      .replace(/@Anio/g, annio.toString())
      .replace(/@Periodo/g, periodo.toString())
      .replace(/@IdDivision/g, idDivision.toString());

    return new Promise<IConciliaReporteValores[]>((resolve, reject) => {
      this.dataSource
        .query(_query)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err.message || err);
        });
    });
  }

  private async _reporteCuadreSistemas(idCentro: number, consolidado: boolean, annio: number, periodo: number): Promise<IConciliaCuadreSistemas[]> {
    return new Promise<IConciliaCuadreSistemas[]>((resolve, reject) => {
      this.dataSource
        .query(`select * from Conta_Cuadre_Sistemas ($1::int, $2::bool, $3::int, $4::int)`, [idCentro, consolidado, annio, periodo])
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err.message || err);
        });
    });
  }

  private async _reporteInformacionContabilidad(idCentro: number, consolidado: boolean, annio: number, periodo: number): Promise<IConciliaInformacionContabilidad[]> {
    return new Promise<IConciliaInformacionContabilidad[]>((resolve, reject) => {
      this.dataSource
        .query(`select * from Conta_Informacion_Contabilidad ($1::int, $2::bool, $3::int, $4::int)`, [idCentro, consolidado, annio, periodo])
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err.message || err);
        });
    });
  }

  async iniciarSaldos(user: UsuariosEntity, iniciarSaldosInput: IniciarSaldosInput): Promise<boolean> {
    try {
      const { idCentro, consolidado, annio } = iniciarSaldosInput;

      return new Promise<boolean>((resolve, reject) => {
        this.dataSource
          .query(`CALL conta_inicializar_datos ($1, $2, $3)`, [idCentro, consolidado, annio])
          .then(() => {
            this._logsSvc
              .insert(idCentro, consolidado, `Iniciar Saldo (${annio})`, user.Usuario)
              .then(() => {
                resolve(true);
              })
              .catch(err => {
                reject(err.message || err);
              });
          })
          .catch(err => {
            reject(err.message || err);
          });
      });
    } catch (err: any) {
      return Promise.reject(err.message || err);
    }
  }

  async arreglaClasificadorCuenta(user: UsuariosEntity, idUnidad: number, tipoUnidad: string, annio: string): Promise<boolean> {
    try {
      // verificar si se ha definido la conexión al Rodas
      const _conexionConta = await this._contaConexionesService.findByIdUnidad(idUnidad, tipoUnidad === '2').catch(err => {
        throw new Error(err);
      });

      // _conexionConta.BaseDatos = `r4_${_conexionConta.BaseDatos.toLowerCase()}`;

      let tipoClasificador = 0;

      switch (tipoUnidad) {
        case '0':
          tipoClasificador = ETipoClasificadorCuenta.Centro;
          break;
        case '1':
          tipoClasificador = ETipoClasificadorCuenta.Complejo;
          break;
        case '2':
          tipoClasificador = ETipoClasificadorCuenta.Consolidado;
          break;
      }

      const _clasifCuentasReal = await this._clasificadorCuentaSvc.getClasificadorCuentaByTipo(tipoClasificador).catch(err => {
        throw new Error(err);
      });

      const bdConta = await this._contaConexionesService.conexionRodas(_conexionConta).catch(err => {
        throw new Error(err);
      });

      for (let index = 0; index < _clasifCuentasReal.length; index++) {
        const _clasif = _clasifCuentasReal[index];

        // inserto o actualizo la cuenta
        const _queryUpdateCC = queryUpdateClasificadorRodas
          .replace(/@Anio/g, annio)
          .replace(/@Cta/g, _clasif.Cuenta)
          .replace(/@SubCta/g, _clasif.SubCuenta)
          .replace(/@Nombre/g, _clasif.Nombre)
          .replace(/@Nat/g, _clasif.Naturaleza)
          .replace(/@An1/g, _clasif.Tipo_Analisis_1 ? `'${_clasif.Tipo_Analisis_1}'` : `null`)
          .replace(/@An2/g, _clasif.Tipo_Analisis_2 ? `'${_clasif.Tipo_Analisis_2}'` : `null`)
          .replace(/@An3/g, _clasif.Tipo_Analisis_3 ? `'${_clasif.Tipo_Analisis_3}'` : `null`)
          .replace(/@An4/g, _clasif.Tipo_Analisis_4 ? `'${_clasif.Tipo_Analisis_4}'` : `null`)
          .replace(/@An5/g, _clasif.Tipo_Analisis_5 ? `'${_clasif.Tipo_Analisis_5}'` : `null`)
          .replace(/@Obl/g, _clasif.Obligacion ? 'true' : 'false')
          .replace(/@Grupo/g, _clasif.Grupo)
          .replace(/@Clase/g, _clasif.Clase)
          .replace(/@Categ/g, _clasif.Categoria)
          .replace(/@Clasif/g, _clasif.Clasificacion)
          .replace(/@Tipo/g, _clasif.Tipo)
          .replace(/@Estado/g, _clasif.Estado);

        await bdConta.query(_queryUpdateCC).catch(err => {
          throw new Error(err);
        });

        // inserto o modifico los criterios de consolidación
        const _queryUpdateCons = queryUpdateCriterioClasificadorRodas
          .replace(/@Cta/g, _clasif.Cuenta)
          .replace(/@SubCta/g, _clasif.SubCuenta)
          .replace(/@TipoAn1Cons/g, _clasif.Tipo_Analisis_1_Cons ? `'${_clasif.Tipo_Analisis_1_Cons}'` : `null`)
          .replace(/@TipoAn2Cons/g, _clasif.Tipo_Analisis_2_Cons ? `'${_clasif.Tipo_Analisis_2_Cons}'` : `null`)
          .replace(/@TipoAn3Cons/g, _clasif.Tipo_Analisis_3_Cons ? `'${_clasif.Tipo_Analisis_3_Cons}'` : `null`)
          .replace(/@TipoAn4Cons/g, _clasif.Tipo_Analisis_4_Cons ? `'${_clasif.Tipo_Analisis_4_Cons}'` : `null`)
          .replace(/@TipoAn5Cons/g, _clasif.Tipo_Analisis_5_Cons ? `'${_clasif.Tipo_Analisis_5_Cons}'` : `null`)
          .replace(/@An1Cons/g, _clasif.Tipo_Analisis_1_Cons === '@' ? idUnidad.toString() : `null`)
          .replace(/@An2Cons/g, _clasif.Tipo_Analisis_2_Cons === '@' ? idUnidad.toString() : `null`)
          .replace(/@An3Cons/g, _clasif.Tipo_Analisis_3_Cons === '@' ? idUnidad.toString() : `null`)
          .replace(/@An4Cons/g, _clasif.Tipo_Analisis_4_Cons === '@' ? idUnidad.toString() : `null`)
          .replace(/@An5Cons/g, _clasif.Tipo_Analisis_5_Cons === '@' ? idUnidad.toString() : `null`);

        await bdConta.query(_queryUpdateCons).catch(err => {
          throw new Error(err);
        });
      }

      // arregla Codificadores del Rodas
      await this._arreglaCodificadoresRodas(bdConta).catch(err => {
        throw new Error(err);
      });

      // arregla asientos del Rodas
      await this._arreglaAsientosRodas(bdConta).catch(err => {
        throw new Error(err);
      });

      return new Promise<boolean>((resolve, reject) => {
        this._logsSvc
          .insert(
            idUnidad,
            tipoClasificador === ETipoClasificadorCuenta.Consolidado,
            `Arregla Clasificador Rodas (${
              tipoClasificador === ETipoClasificadorCuenta.Centro ? 'Centro' : tipoClasificador === ETipoClasificadorCuenta.Complejo ? 'Complejo' : 'Consolidado'
            }/${annio})`,
            user.Usuario,
          )
          .then(() => {
            resolve(true);
          })
          .catch(err => {
            reject(err);
          });
      });
    } catch (err: any) {
      return Promise.reject(err.message || err);
    }
  }

  private async _arreglaCodificadoresRodas(bdConta: DataSource): Promise<void> {
    const _querysArray = [
      `UPDATE contabilidad.tipos_analisis
      set nemo = 'SUBELE'
      WHERE codigo = 'L';`,
    ];

    for (let index = 0; index < _querysArray.length; index++) {
      const _query = _querysArray[index];

      await bdConta.query(_query).catch(err => {
        throw new Error(err);
      });
    }

    return new Promise<void>(async resolve => {
      resolve();
    });
  }

  private async _arreglaAsientosRodas(bdConta: DataSource): Promise<void> {
    const _querysArray = [
      // elimino los criterios que sobran en los asientos
      `UPDATE contabilidad.asientos
      SET analisis_1 = case when tipo_analisis_1 is null then null else analisis_1 end,
          analisis_2 = case when tipo_analisis_2 is null then null else analisis_2 end,
          analisis_3 = case when tipo_analisis_3 is null then null else analisis_3 end,
          analisis_4 = case when tipo_analisis_4 is null then null else analisis_4 end,
          analisis_5 = case when tipo_analisis_5 is null then NULL else analisis_5 end;`,
      // insertar un trabajador en la cuenta 350/0060 cuando el análisis estuviera en NULL
      `UPDATE contabilidad.asientos as a
      SET tipo_analisis_1 = c.tipo_analisis_1,
          analisis_1 = CASE WHEN c.tipo_analisis_1 = 'N' AND analisis_1 IS NULL THEN
          (SELECT codigo FROM contabilidad.analisis WHERE anno = 2023 and tipo = 'N' LIMIT 1)
        ELSE
          analisis_1
        END,
      tipo_analisis_2 = c.tipo_analisis_2,
      analisis_2 = CASE WHEN c.tipo_analisis_2 = 'N' AND analisis_2 IS NULL THEN
          (SELECT codigo FROM contabilidad.analisis WHERE anno = 2023 and tipo = 'N' LIMIT 1)
        ELSE
          analisis_2
        END,
      tipo_analisis_3 = c.tipo_analisis_3,
      analisis_3 = CASE WHEN c.tipo_analisis_3 = 'N' AND analisis_3 IS NULL THEN
          (SELECT codigo FROM contabilidad.analisis WHERE anno = 2023 and tipo = 'N' LIMIT 1)
        ELSE
          analisis_3
        END
      from contabilidad.cuentas as c 
      WHERE a.anno_comprobante = c.anno and a.cuenta = c.cuenta and a.subcuenta = c.subcuenta 
        and c.anno = 2023 and c.cuenta = '350' and c.subcuenta = '0060';`,
    ];

    for (let index = 0; index < _querysArray.length; index++) {
      const _query = _querysArray[index];

      await bdConta.query(_query).catch(err => {
        throw new Error(err);
      });
    }

    return new Promise<void>(async resolve => {
      resolve();
    });
  }

  async chequearCentro(chequearCentrosInput: ChequearCentrosInput): Promise<IChequeoCentroVsConsolidado[]> {
    try {
      const { idCentro, annio, periodo, centrosAChequear } = chequearCentrosInput;

      const cons = idCentro === 100 ? 1 : 0;

      for (let index = 0; index < centrosAChequear.length; index++) {
        const centroChe = centrosAChequear[index];

        await this.dataSource.query(`CALL conta_insert_chequeo_centro_vs_consolidado ($1, $2, $3, $4, $5)`, [idCentro, cons, annio, periodo, centroChe]).catch(err => {
          throw new Error(err.message || err);
        });
      }

      return new Promise<IChequeoCentroVsConsolidado[]>((resolve, reject) => {
        this.dataSource
          .query(`select * from conta_chequeo_centro ($1, $2, $3, $4)`, [idCentro, annio, periodo, centrosAChequear.join(', ')])
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err.message || err);
          });
      });
    } catch (err: any) {
      return Promise.reject(err.message || err);
    }
  }
}
