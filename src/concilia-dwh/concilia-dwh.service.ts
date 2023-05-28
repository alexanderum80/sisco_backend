import { XmlJsService } from './../shared/services/xml-js/xml-js.service';
import { DivisionesService } from './../divisiones/divisiones.service';
import { ConciliaContaService } from './../concilia-conta/concilia-conta.service';
import { ContaConexionesService } from './../conta-conexiones/conta-conexiones.service';
import { DWHConexiones } from './../dwh-conexiones/dwh-conexiones.entity';
import { UnidadesEntity } from './../unidades/unidades.entity';
import { DwhConexionesService } from './../dwh-conexiones/dwh-conexiones.service';
import { UnidadesService } from './../unidades/unidades.service';
import { ConciliaDWH, ConciliaDWHInput, queryInventarioDWH, queryVentasDWH } from './concilia-dwh.model';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ContaConexionesEntity } from './../conta-conexiones/conta-conexiones.entity';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class ConciliaDwhService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private _unidadesService: UnidadesService,
    private _dwhConexionesService: DwhConexionesService,
    private _contaConexionesService: ContaConexionesService,
    private _conciliaContaService: ConciliaContaService,
    private _divisionesService: DivisionesService,
    private _xmlSvc: XmlJsService,
  ) {}

  async conciliaDWH(conciliaDWHInput: ConciliaDWHInput): Promise<ConciliaDWH[]> {
    try {
      const { idDivision, idCentro, annio, periodo, tipoCentro, ventasAcumuladas } = conciliaDWHInput;

      // obtener listado de las divisiones
      const _divisiones =
        idCentro === 100 && tipoCentro === 1
          ? await this._divisionesService.getDivisionesActivas().catch(err => {
              throw new Error(err);
            })
          : await this._divisionesService.getDivisionById(idDivision).catch(err => {
              throw new Error(err);
            });

      for (let i = 0; i < _divisiones.length; i++) {
        const divisionInfo = _divisiones[i];

        // verificar si se ha definido la conexion al DWH
        const _conexionDWHQuery = await this._dwhConexionesService.DWHConexion(divisionInfo.IdDivision);
        if (!_conexionDWHQuery.success) {
          throw new Error(_conexionDWHQuery.error + ' No se pudo obtener la Conexión al DWH de la División ' + divisionInfo.IdDivision);
        }
        if (!_conexionDWHQuery.data) {
          throw new Error(`No se ha definido ninguna conexión de la División ${divisionInfo.IdDivision} a los DWH.`);
        }
        const _conexionDWH = _conexionDWHQuery.data;
        if (_conexionDWH.ConexionDWH === '') {
          throw new Error(`No se ha definido la conexión al DWH de la División ${divisionInfo.IdDivision}.`);
        }
        if (_conexionDWH.ConexionRest === '') {
          throw new Error(`No se ha definido la conexión al DWH de Restaura de la División ${divisionInfo.IdDivision}.`);
        }

        // verificar si se ha definido la conexión al Rodas
        // verificar si se ha definido la conexión al Rodas
        const _conexionRodas = await this._contaConexionesService.findByIdUnidad(tipoCentro === 0 ? idCentro : divisionInfo.IdDivision, tipoCentro === 1).catch(err => {
          throw new Error(err);
        });
        // _conexionRodas.BaseDatos = `r4_${_conexionRodas.BaseDatos.toLowerCase()}`;

        // obtener listados de las unidades subordinadas
        let _unidadesQuery: any;
        switch (tipoCentro) {
          case 0:
            _unidadesQuery = await this._unidadesService.getUnidadesAbiertasByIdSubdivision(idCentro);
            break;
          case 1:
            _unidadesQuery = await this._unidadesService.getUnidadesAbiertasByIdDivision(idCentro);
            break;
        }
        if (!_unidadesQuery.success) {
          throw new Error(_unidadesQuery.error);
        }
        const _unidades = _unidadesQuery.data;

        // importar datos del DWH
        await this._importarDatosDWH(idCentro, annio, periodo, tipoCentro, ventasAcumuladas, _unidades, _conexionDWH).catch(err => {
          throw new Error(err);
        });

        // importar datos del Rodas
        await this._importarDatosRodas(annio, periodo, idCentro, tipoCentro, _conexionRodas).catch(err => {
          throw new Error(err);
        });
      }

      return new Promise<ConciliaDWH[]>((resolve, reject) => {
        // calculo la conciliacion
        this._calculaConciliacion(idCentro, annio, periodo, tipoCentro, ventasAcumuladas)
          .then(results => {
            resolve(results);
          })
          .catch(err => {
            reject(err.message || err);
          });
      });
    } catch (err: any) {
      return Promise.reject(err.message || err);
    }
  }

  private async _importarDatosDWH(
    idCentro: number,
    annio: number,
    mes: number,
    tipoCentro: number,
    ventasAcumuladas: boolean,
    unidades: UnidadesEntity[],
    dwhConexiones: DWHConexiones,
  ): Promise<void> {
    let dwhConnectionDivision: DataSource;
    let dwhConnectionRestaurador: DataSource;
    let dwhConnectionEmpresa: DataSource;
    try {
      dwhConnectionDivision = await (await this._dwhConexionesService.conexionDWH(dwhConexiones.ConexionDWH.toString())).initialize();
      dwhConnectionRestaurador = await (await this._dwhConexionesService.conexionDWH(dwhConexiones.ConexionRest.toString())).initialize();
      dwhConnectionEmpresa = await (await this._dwhConexionesService.conexionRestEmpresa()).initialize();

      // borro los datos del Golden DWH
      await this.dataSource.query(`DELETE FROM DWH_Inventario WHERE Id_Centro = ${idCentro} AND Periodo = ${mes}`);
      await this.dataSource.query(`DELETE FROM DWH_Ventas WHERE Id_Centro = ${idCentro} AND Periodo = ${mes}`);

      // importo los datos de cada una de las unidades
      for (let index = 0; index < unidades.length; index++) {
        const unidadInfo = unidades[index];

        // importo los almacenes de la división
        await this._importarAlmacenesDWH(unidadInfo.IdUnidad, dwhConnectionDivision).catch(err => {
          throw new Error(err + ' No se pudo importar Almacenes de la Unidad ' + unidadInfo.IdUnidad);
        });

        // importo el inventario de la división
        await this._importarInventarioDWH(idCentro, annio, mes, unidadInfo.IdUnidad, tipoCentro, dwhConnectionDivision).catch(err => {
          throw new Error(err + ' No se pudo importar Inventario DWH de la Unidad ' + unidadInfo.IdUnidad);
        });

        await this._importarInventarioDWH(idCentro, annio, mes, unidadInfo.IdUnidad, tipoCentro, dwhConnectionRestaurador, true).catch(err => {
          throw new Error(err + ' No se pudo importar Inventario DWH de la Unidad ' + unidadInfo.IdUnidad);
        });

        // importo las ventas de la división
        await this._importarVentasDWH(idCentro, annio, mes, unidadInfo, tipoCentro, ventasAcumuladas, dwhConnectionDivision).catch(err => {
          throw new Error(err + ' No se pudo importar Ventas DWH de la Unidad ' + unidadInfo.IdUnidad);
        });

        await this._importarVentasDWH(idCentro, annio, mes, unidadInfo, tipoCentro, ventasAcumuladas, dwhConnectionRestaurador, true).catch(err => {
          throw new Error(err + ' No se pudo importar Ventas DWH de la Unidad ' + unidadInfo.IdUnidad);
        });

        // importo de la Empresa
        await this._importarAlmacenesDWH(unidadInfo.IdUnidad, dwhConnectionEmpresa, true).catch(err => {
          throw new Error(err + ' No se pudo importar Almacenes DWH de la Unidad ' + unidadInfo.IdUnidad);
        });

        await this._importarInventarioDWH(idCentro, annio, mes, unidadInfo.IdUnidad, tipoCentro, dwhConnectionEmpresa, false, true).catch(err => {
          throw new Error(err + ' No se pudo importar Inventario DWH Empresa de la Unidad ' + unidadInfo.IdUnidad);
        });

        await this._importarVentasDWH(idCentro, annio, mes, unidadInfo, tipoCentro, ventasAcumuladas, dwhConnectionEmpresa, false, true).catch(err => {
          throw new Error(err + ' No se pudo importar Ventas DWH Empresa de la Unidad ' + unidadInfo.IdUnidad);
        });
      }

      // if (dwhConnectionDivision && dwhConnectionDivision.isInitialized) dwhConnectionDivision.destroy();
      // if (dwhConnectionDivision && dwhConnectionRestaurador.isInitialized) dwhConnectionRestaurador.destroy();
      // if (dwhConnectionDivision && dwhConnectionEmpresa.isInitialized) dwhConnectionEmpresa.destroy();
    } catch (err: any) {
      throw new Error(err.message || err);
    }
  }

  private async _importarAlmacenesDWH(idUnidad: number, dataSource: DataSource, isDistribuidor = false): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      dataSource
        .query(
          `SELECT IdGerenciaIdAlmacen as idgerencia_idalmacen, IdUnidad as id_unidad, Almacen as almacen, ISNULL(IdPiso, 0) AS IdPiso, ISNULL(EContable, '') AS econtable, ISNULL(EContableMN, '') AS econtable_mn, ISNULL(Abierto, 0) AS abierto, ISNULL(Exhibicion, 0) AS exhibicion,
                  ISNULL(Interno, 0) AS interno, ISNULL(Merma, 0) AS merma, ISNULL(Gastronomia, 0) AS gastronomia, ISNULL(Insumo, 0) AS insumo, ISNULL(Inversiones, 0) AS inversiones, ISNULL(Boutique, 0) AS boutique,
                  ISNULL(MermaOrigen, 0) AS merma_origen, ISNULL(Consignacion, 0) AS consignacion, ISNULL(Emergente, 0) AS emergente, ISNULL(ReservaDiv, 0) AS reserva_div, ISNULL(ReservaNac, 0) AS reserva_nac,
                  ISNULL(DespachoDiv, 0) AS despacho_div, ISNULL(OrigenReplica, 0) AS origen_replica, ISNULL(DestinoReplica, 0) AS destino_replica, ISNULL(CapacidadFrio, 0) AS capacidad_frio, ISNULL(Ociosos, 0) AS ociosos,
                  ISNULL(LentoMov, 0) AS lento_mov, ISNULL(MercanciaVenta, 0) AS mercancia_venta
                  FROM            UnidadesComerciales.dbo.Almacenes
                  WHERE        (IdUnidad = ${idUnidad})`,
        )
        .then(async result => {
          if (result) {
            // const _almacenes = this._xmlSvc.jsonToXML('Almacenes', result);

            await this.dataSource
              // .query(`CALL public.dwh_import_almacenes('${JSON.stringify(result)}'::json, ${idUnidad}::integer, ${isDistribuidor}::boolean)`)
              .query(`CALL public.dwh_import_almacenes($1::json, $2::integer, $3::boolean)`, [JSON.stringify(result), idUnidad, isDistribuidor])
              .then(() => {
                resolve();
              })
              .catch(err => {
                reject(err.message || err);
              });
          }
        })
        .catch(err => {
          reject(err.message || err);
        });
    });
  }

  private async _importarInventarioDWH(
    idCentro: number,
    annio: number,
    mes: number,
    idUnidad: number,
    tipoCentro: number,
    dataSource: DataSource,
    isRestaura = false,
    isDistribuidor = false,
  ): Promise<void> {
    try {
      const query = queryInventarioDWH
        .replace(/@Anio/g, annio.toString())
        .replace(/@Mes/g, mes.toString())
        .replace(/@Centro/g, idCentro.toString())
        .replace(/@Unidad/g, idUnidad.toString())
        .replace(/@Cons/g, tipoCentro.toString());

      return new Promise<void>((resolve, reject) => {
        dataSource
          .query(query)
          .then(async result => {
            if (result) {
              // const _inventario = this._xmlSvc.jsonToXML('DWH', result);

              await this.dataSource
                .query(`CALL DWH_Import_Inventario ($1::json, $2::integer, $3::integer, $4::boolean, $5::boolean, $6::boolean)`, [
                  JSON.stringify(result),
                  idCentro,
                  mes,
                  tipoCentro === 1,
                  isRestaura,
                  isDistribuidor,
                ])
                .then(() => {
                  resolve();
                })
                .catch(err => {
                  reject(err.message || err);
                });
            }
          })
          .catch(err => {
            reject(err.message || err);
          });
      });
    } catch (err: any) {
      return Promise.reject(err.message || err);
    }
  }

  private async _importarVentasDWH(
    idCentro: number,
    annio: number,
    mes: number,
    unidadInfo: UnidadesEntity,
    tipoCentro: number,
    ventasAcumuladas: boolean,
    dataSource: DataSource,
    isRestaura = false,
    isDistribuidor = false,
  ): Promise<void> {
    try {
      let query = queryVentasDWH;

      if (ventasAcumuladas) {
        query = query.replace(/= @Mes/g, '<= @Mes');
      }

      query = query
        .replace(/@Anio/g, annio.toString())
        .replace(/@Mes/g, mes.toString())
        .replace(/@Centro/g, idCentro.toString())
        .replace(/@Unidad/g, unidadInfo.IdUnidad.toString())
        .replace(/@Cons/g, tipoCentro.toString());

      return new Promise<void>((resolve, reject) => {
        dataSource
          .query(query)
          .then(async result => {
            if (result) {
              // const _ventas = this._xmlSvc.jsonToXML('DWH', result);

              await this.dataSource
                .query(`CALL DWH_Import_Ventas ($1::json, $2::integer, $3::integer, $4::boolean, $5::boolean, $6::boolean)`, [
                  JSON.stringify(result),
                  idCentro,
                  mes,
                  tipoCentro === 1,
                  isRestaura,
                  isDistribuidor,
                ])
                .then(() => {
                  resolve();
                })
                .catch(err => {
                  reject(err.message || err);
                });
            }
          })
          .catch(err => {
            reject(err.message || err);
          });
      });
    } catch (err: any) {
      return Promise.reject(err.message || err);
    }
  }

  private async _importarDatosRodas(annio: number, periodo: number, idUnidad: number, tipoCentro: number, contaConexion: ContaConexionesEntity): Promise<void> {
    try {
      const cons = tipoCentro === 1;

      // me conecto al Rodas del Centro
      const rodasConnection = await this._contaConexionesService.conexionRodas(contaConexion);

      // importo los asientos del rodas
      await this._conciliaContaService.importarContabilidad(idUnidad, annio, periodo, cons, rodasConnection);
      // if (!_importarAsientoRodas.success) {
      //     return { success: false, error: _importarAsientoRodas.error + ' No se pudo importar Asientos del Rodas de la Unidad ' + idUnidad };
      // }

      if (rodasConnection.isInitialized) rodasConnection.destroy();
    } catch (err: any) {
      throw new Error(err.message || err);
    }
  }

  private async _calculaConciliacion(idUnidad: number, annio: number, periodo: number, tipoCentro: number, ventasAcumuladas: boolean): Promise<ConciliaDWH[]> {
    const cons = tipoCentro === 1;

    return new Promise<ConciliaDWH[]>((resolve, reject) => {
      // calculo el inventario y la venta
      this.dataSource
        .query(`SELECT * from DWH_Calcula_Conciliacion ($1, $2, $3, $4, $5)`, [cons, idUnidad, annio, periodo, ventasAcumuladas])
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err.message ? err.message : err);
        });
    });
  }
}
