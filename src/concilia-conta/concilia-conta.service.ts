import { LogsService } from './../logs/logs.service';
import { ContaConexionesEntity } from './../conta-conexiones/conta-conexiones.entity';
import { reject, toNumber } from 'lodash';
import { Usuarios } from './../usuarios/usuarios.entity';
import { ETipoClasificadorCuenta } from './../clasificador-cuenta/clasificador-cuenta.model';
import { ClasificadorCuentaService } from './../clasificador-cuenta/clasificador-cuenta.service';
import { XmlJsService } from './../shared/services/xml-js/xml-js.service';
import { UnidadesService } from './../unidades/unidades.service';
import { ContaConexionesService } from './../conta-conexiones/conta-conexiones.service';
import { Injectable } from '@nestjs/common';
import {
  queryUltimoPeriodo,
  queryComprobantesRodas,
  queryAsientoRodas,
  queryRangoAsientosMesRodas,
  querySaldosAcumuladosRodas,
  ConciliaContaInput,
  queryClasificadorCuentasRodas,
  ConciliaContabilidadQueryResponse,
  queryReporteConsultas,
  ConciliaContaQueryResponse,
  queryReporteExpresiones,
  queryReporteValores,
  IniciarSaldosInput,
  ChequearCentrosInput,
  // queryInsertClasificadorRodas,
  // queryInsertCriterioConsolidacionRodas,
  queryUpdateCriterioClasificadorRodas,
  queryUpdateClasificadorRodas,
} from './concilia-conta.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ConciliaContaService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private _contaConexionesService: ContaConexionesService,
    private _unidadesService: UnidadesService,
    private _xmlJsService: XmlJsService,
    private _clasificadorCuentaSvc: ClasificadorCuentaService,
    private _logsSvc: LogsService,
  ) {}

  async conciliaContabilidad(user: Usuarios, conciliaContaInput: ConciliaContaInput): Promise<ConciliaContabilidadQueryResponse> {
    try {
      const { IdDivision } = user;
      const { idCentro, periodo, annio, tipoCentro, tipoEntidad } = conciliaContaInput;
      const consolidado = tipoCentro === 2 ? '1' : '0';

      // verificar si se ha definido la conexión al Rodas
      const _conexionRodasQuery = await this._contaConexionesService.findByIdUnidad(idCentro, tipoCentro === 2).catch(err => {
        throw new Error(err);
      });

      const _conexionConta = _conexionRodasQuery.data;
      // _conexionConta.BaseDatos = `r4_${_conexionConta.BaseDatos.toLowerCase()}`;

      // conecto al Conta del Centro
      const _contaConexionCentro: DataSource = await this._contaConexionesService.conexionRodas(_conexionConta);

      // importar y chequear el clasificador de cuentas
      const _chequeaClasifRes = await this._importarClasificador(idCentro, tipoCentro, annio, consolidado, periodo, _contaConexionCentro);
      if (_chequeaClasifRes.data.length) {
        // cierro la conexión al Rodas del Centro
        if (_contaConexionCentro && _contaConexionCentro.isInitialized) _contaConexionCentro.destroy();

        return {
          success: false,
          data: {
            ReporteClasificador: {
              success: false,
              data: JSON.stringify(_chequeaClasifRes.data),
            },
            ReporteConsultas: {
              success: true,
            },
            ReporteExpresiones: {
              success: true,
            },
            ReporteValores: {
              success: true,
            },
            CuadreSistemas: {
              success: true,
            },
            Informacion: {
              success: true,
            },
          },
          error:
            'Usted tiene errores en el Clasificador, lo que conlleva a que no pueda terminar el análisis, ni entregar el balance a nivel superior. Vaya a la pestaña Análisis del Clasificador y Corrija estos errores.',
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
      return {
        success: false,
        data: {
          ReporteClasificador: {
            success: true,
            data: JSON.stringify(''),
          },
          ReporteConsultas: {
            success: true,
          },
          ReporteExpresiones: {
            success: true,
          },
          ReporteValores: {
            success: true,
          },
          CuadreSistemas: {
            success: true,
          },
          Informacion: {
            success: true,
          },
        },
        error: err.message ? err.message : err,
      };
    }
  }

  async _importarClasificador(idUnidad: number, tipoCentro: number, annio: number, cons: string, periodo: number, contaConexion: DataSource): Promise<any> {
    try {
      // inserto el clasificador del Rodas
      const _queryClasifCuentasRes = await contaConexion.query(queryClasificadorCuentasRodas.replace(/@anno/gi, annio.toString())).catch(err => {
        throw new Error(err.message || err);
      });

      let _clasifCuentasXML = this._xmlJsService.jsonToXML('Cuentas', {});

      if (_queryClasifCuentasRes.length) {
        _clasifCuentasXML = this._xmlJsService.jsonToXML('Cuentas', _queryClasifCuentasRes);

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
            .query(`EXEC dbo.pConta_ImportClasifCuentaXML @0, @1, @2, @3, @4, @5`, [_clasifCuentasXML, idUnidad, tipoClasif, cons, annio, periodo])
            .then(result => {
              resolve({ data: result });
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

  async importarContabilidad(idUnidad: number, annio: number, periodo: number, cons: string, contaConexion: DataSource): Promise<void> {
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
        _ultimoPeriodo = toNumber(_ultimoPeriodoRes[0].Periodo);
      }

      // chequear los datos adulterados
      await this._chequeaDatosAdulterados(idUnidad, contaConexion);

      // arregla asientos
      await this._arreglaAsientos(contaConexion).catch(err => {
        throw new Error(err);
      });

      if (_ultimoPeriodo > 0) {
        // chequear saldos acumulados hasta el periodo anterior
        await this._chequearSaldoAcumulados(idUnidad, annio, _ultimoPeriodo, cons, contaConexion);
      }

      const _periodoInicial = _ultimoPeriodo < periodo ? _ultimoPeriodo : periodo;

      for (let per = _periodoInicial; per <= periodo; per++) {
        // importar los comprobantes
        await this._importarComprobantes(idUnidad, annio, per, cons, contaConexion);

        // importar los asientos
        await this._importarAsientos(idUnidad, annio, per, cons, contaConexion);
      }

      // cierro la conexión al Rodas del Centro
      if (contaConexion && contaConexion.isInitialized) contaConexion.destroy();

      await this._updateFechaActualizacion(idUnidad, cons === '1').catch(err => {
        throw new Error(err.message || err);
      });
    } catch (err: any) {
      if (contaConexion && contaConexion.isInitialized) contaConexion.destroy();

      throw new Error(err.message || err);
    }
  }

  private async _chequeaDatosAdulterados(idUnidad: number, conexionRodas: DataSource): Promise<void> {
    const _queryAsientos = queryRangoAsientosMesRodas;

    const _unidadRes = await this._unidadesService.getUnidadById(idUnidad);
    if (!_unidadRes.success) {
      throw new Error(_unidadRes.error.toString());
    }

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

  private async _chequearSaldoAcumulados(idUnidad: number, annio: number, periodo: number, cons: string, conexionRodas: DataSource): Promise<void> {
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
      .query('EXEC dbo.pConta_SaldoAcumulado @0, @1, @2, @3, @4, @5', [idUnidad, cons, annio, periodo, _saldoDebito, _saldoCredito])
      .then(result => {
        if (result[0].DifDebito !== 0 || result[0].DifCredito !== 0) {
          const _error = `Los Saldos Acumulados entre el Rodas y SISCO hasta el período ${periodo - 1} no coinciden.
                    Concilie el período anterior, y después concilie el actual.\n\nNo se continuará con la Conciliación.`;

          throw new Error(_error);
        }
      })
      .catch(err => {
        throw new Error(err.message || err);
      });
  }

  private async _importarComprobantes(idUnidad: number, annio: number, periodo: number, cons: string, rodasConexion: DataSource): Promise<void> {
    const _queryComprobantes = queryComprobantesRodas.replace(/@anno/g, annio.toString()).replace(/@periodo/g, periodo.toString());
    const _queryCompRes = await rodasConexion
      .query(_queryComprobantes)
      .then(result => {
        return result;
      })
      .catch(err => {
        throw new Error(err.message || err);
      });

    if (_queryCompRes.length) {
      const _comprobantes = this._xmlJsService.jsonToXML('Comprobantes', _queryCompRes);

      await this.dataSource.query(`EXEC dbo.pConta_ImportComprobanteXML @0, @1, @2, @3, @4`, [_comprobantes, idUnidad, cons, annio, periodo]).catch(err => {
        throw new Error(err.message || err);
      });
    }
  }

  private async _importarAsientos(idUnidad: number, annio: number, periodo: number, cons: string, rodasConexion: DataSource): Promise<void> {
    const _queryAsientos = queryAsientoRodas.replace(/@anno/g, annio.toString()).replace(/@periodo/g, periodo.toString());

    const _queryAsientosRes = await rodasConexion
      .query(_queryAsientos)
      .then(result => {
        return result;
      })
      .catch(err => {
        throw new Error(err.message || err);
      });

    if (_queryAsientosRes.length) {
      const _asientos = this._xmlJsService.jsonToXML('Asiento', _queryAsientosRes);

      await this.dataSource.query(`EXEC dbo.pConta_ImportAsientoXML @0, @1, @2, @3, @4`, [_asientos, idUnidad, cons, annio, periodo]).catch(err => {
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
    let cons = '0';

    switch (tipoClasificador) {
      case 0:
        tipoClasificador = 2;
        break;
      case 1:
        tipoClasificador = 3;
        break;
      case 2:
        cons = '1';
        tipoClasificador = 1;
        tipoEntidad = 1;
        break;
    }

    await this.dataSource
      .query(`EXEC dbo.pConta_CalculaConciliacion @0, @1, @2, @3, @4, @5, @6`, [idUnidad, tipoClasificador, tipoEntidad, cons, anio, periodo, idDivision])
      .catch(err => {
        throw new Error(err.message || err);
      });
  }

  private async _getReportesConciliacion(idCentro: number, consolidado: string, annio: number, periodo: number, idDivision: number): Promise<ConciliaContabilidadQueryResponse> {
    // devuelvo el resultado de la conciliación
    const _queryReporteConsultas = this._reporteConsultas(idCentro, consolidado, annio, periodo, 1);
    const _queryReporteExpresiones = this._reporteExpresiones(idCentro, consolidado, annio, periodo);
    const _queryReporteValores = this._reporteValores(idCentro, consolidado, annio, periodo, idDivision);
    const _queryReporteCuadreSistemas = this._reporteCuadreSistemas(idCentro, consolidado, annio, periodo);
    const _queryReporteInformacion = this._reporteInformacionContabilidad(idCentro, consolidado, annio, periodo);

    return new Promise<ConciliaContabilidadQueryResponse>(resolve => {
      Promise.all([_queryReporteConsultas, _queryReporteExpresiones, _queryReporteValores, _queryReporteCuadreSistemas, _queryReporteInformacion])
        .then(result => {
          resolve({
            success: true,
            data: {
              ReporteClasificador: {
                success: true,
                data: JSON.stringify(''),
              },
              ReporteConsultas: {
                success: true,
                data: result[0].data,
              },
              ReporteExpresiones: {
                success: true,
                data: result[1].data,
              },
              ReporteValores: {
                success: true,
                data: result[2].data,
              },
              CuadreSistemas: {
                success: true,
                data: result[3].data,
              },
              Informacion: {
                success: true,
                data: result[4].data,
              },
            },
          });
        })
        .catch(err => {
          throw new Error(err);
        });
    });
  }

  private async _reporteConsultas(idUnidad: number, cons: string, annio: number, periodo: number, idConsulta: number): Promise<ConciliaContaQueryResponse> {
    const _query = queryReporteConsultas
      .replace(/@Centro/g, idUnidad.toString())
      .replace(/@Consolidado/g, cons)
      .replace(/@Anio/g, annio.toString())
      .replace(/@Periodo/g, periodo.toString())
      .replace(/@IdConsulta/g, idConsulta.toString());

    return new Promise<ConciliaContaQueryResponse>(resolve => {
      this.dataSource
        .query(_query)
        .then(result => {
          resolve({
            success: true,
            data: JSON.stringify(result),
          });
        })
        .catch(err => {
          resolve({ success: false, error: err.message ? err.message : err });
        });
    });
  }

  private async _reporteExpresiones(idUnidad: number, cons: string, annio: number, periodo: number): Promise<ConciliaContaQueryResponse> {
    const _query = queryReporteExpresiones
      .replace(/@Centro/g, idUnidad.toString())
      .replace(/@Consolidado/g, cons)
      .replace(/@Anio/g, annio.toString())
      .replace(/@Periodo/g, periodo.toString());

    return new Promise<ConciliaContaQueryResponse>(resolve => {
      this.dataSource
        .query(_query)
        .then(result => {
          resolve({
            success: true,
            data: JSON.stringify(result),
          });
        })
        .catch(err => {
          resolve({ success: false, error: err.message ? err.message : err });
        });
    });
  }

  private async _reporteValores(idUnidad: number, cons: string, annio: number, periodo: number, idDivision: number): Promise<ConciliaContaQueryResponse> {
    const _query = queryReporteValores
      .replace(/@Centro/g, idUnidad.toString())
      .replace(/@Consolidado/g, cons)
      .replace(/@Anio/g, annio.toString())
      .replace(/@Periodo/g, periodo.toString())
      .replace(/@IdDivision/g, idDivision.toString());

    return new Promise<ConciliaContaQueryResponse>(resolve => {
      this.dataSource
        .query(_query)
        .then(result => {
          resolve({
            success: true,
            data: JSON.stringify(result),
          });
        })
        .catch(err => {
          resolve({ success: false, error: err.message ? err.message : err });
        });
    });
  }

  private async _reporteCuadreSistemas(idCentro: number, consolidado: string, annio: number, periodo: number): Promise<ConciliaContaQueryResponse> {
    try {
      return new Promise<ConciliaContaQueryResponse>(resolve => {
        this.dataSource
          .query(`EXEC dbo.pConta_CuadreSistemas @0, @1, @2, @3`, [idCentro, consolidado, annio, periodo])
          .then(res => {
            resolve({ success: true, data: JSON.stringify(res) });
          })
          .catch(err => {
            return { success: false, error: err.message ? err.message : err };
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  private async _reporteInformacionContabilidad(idCentro: number, consolidado: string, annio: number, periodo: number): Promise<ConciliaContaQueryResponse> {
    try {
      return new Promise<ConciliaContaQueryResponse>(resolve => {
        this.dataSource
          .query(`EXEC dbo.pConta_InformacionContabilidad @0, @1, @2, @3`, [idCentro, consolidado, annio, periodo])
          .then(res => {
            resolve({ success: true, data: JSON.stringify(res) });
          })
          .catch(err => {
            return { success: false, error: err.message ? err.message : err };
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  private async _arreglaAsientos(bdConta: DataSource): Promise<void> {
    const _querysArray = [
      `UPDATE contabilidad.asientos
      SET analisis_1 = case when tipo_analisis_1 is null then null else analisis_1 end,
        analisis_2 = case when tipo_analisis_2 is null then null else analisis_2 end,
        analisis_3 = case when tipo_analisis_3 is null then null else analisis_3 end,
        analisis_4 = case when tipo_analisis_4 is null then null else analisis_4 end,
        analisis_5 = case when tipo_analisis_5 is null then NULL else analisis_5 end;`,
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

  async iniciarSaldos(user: Usuarios, iniciarSaldosInput: IniciarSaldosInput): Promise<boolean> {
    try {
      const { idCentro, consolidado, annio } = iniciarSaldosInput;

      return new Promise<boolean>(resolve => {
        this.dataSource
          .query(`EXEC dbo.pConta_InicializarDatos @0, @1, @2`, [idCentro, consolidado, annio])
          .then(() => {
            this._logsSvc
              .insert(idCentro, consolidado, `Iniciar Saldo (${annio})`, user.Usuario)
              .then(() => {
                resolve(true);
              })
              .catch(err => {
                reject(err);
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

  async arreglaClasificadorCuenta(user: Usuarios, idUnidad: number, tipoUnidad: string, annio: string): Promise<boolean> {
    try {
      // verificar si se ha definido la conexión al Rodas
      const _conexionRodasQuery = await this._contaConexionesService.findByIdUnidad(idUnidad, tipoUnidad === '2');
      const _conexionConta = _conexionRodasQuery.data;

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

      const bdConta = await this._contaConexionesService.conexionRodas(_conexionConta);

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

      return new Promise<boolean>(resolve => {
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

  async chequearCentro(chequearCentrosInput: ChequearCentrosInput): Promise<ConciliaContaQueryResponse> {
    try {
      const { idCentro, annio, periodo, centrosAChequear } = chequearCentrosInput;

      const cons = idCentro === 100 ? 1 : 0;

      for (let index = 0; index < centrosAChequear.length; index++) {
        const centroChe = centrosAChequear[index];

        await this.dataSource.query(`EXEC dbo.InsertChequeoCentroVsConsolidado @0, @1, @2, @3, @4`, [idCentro, cons, annio, periodo, centroChe]).catch(err => {
          throw new Error(err.message || err);
        });
      }

      return new Promise<ConciliaContaQueryResponse>(resolve => {
        this.dataSource
          .query(`EXEC dbo.p_ChequeoCentro @0`, [`Centro = ${idCentro} AND Periodo = ${periodo} AND Unidad IN (${centrosAChequear.join(', ')})`])
          .then(result => {
            resolve({ success: true, data: JSON.stringify(result) });
          })
          .catch(err => {
            resolve({ success: false, error: err.message ? err.message : err });
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }
}
