import { XmlJsService } from './../shared/services/xml-js/xml-js.service';
import { DivisionesService } from './../divisiones/divisiones.service';
import { ConciliaContaService } from './../concilia-conta/concilia-conta.service';
import { ContaConexionesService } from './../conta-conexiones/conta-conexiones.service';
import { AlmacenesService } from './../almacenes/almacenes.service';
import { DWHConexiones } from './../dwh-conexiones/dwh-conexiones.entity';
import { Unidades } from './../unidades/unidades.entity';
import { DwhConexionesService } from './../dwh-conexiones/dwh-conexiones.service';
import { UnidadesService } from './../unidades/unidades.service';
import { ConciliaDWHInput, queryInventarioDWH, queryVentasDWH } from './concilia-dwh.model';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { Injectable } from '@nestjs/common';
import { UnidadesQueryResponse } from './../unidades/unidades.model';
import { DataSource } from 'typeorm';
import { ContaConexiones } from './../conta-conexiones/conta-conexiones.entity';
import { InjectConnection } from '@nestjs/typeorm';

@Injectable()
export class ConciliaDwhService {
    constructor(
        @InjectConnection() private readonly connection: DataSource,
        private _unidadesService: UnidadesService,
        private _dwhConexionesService: DwhConexionesService,
        private _contaConexionesService: ContaConexionesService,
        private _almacenesService: AlmacenesService,
        private _conciliaContaService: ConciliaContaService,
        private _divisionesService: DivisionesService,
        private _xmlSvc: XmlJsService,
    ) {}

    async conciliaDWH(conciliaDWHInput: ConciliaDWHInput): Promise<any> {
        try {
            const { idDivision, idCentro, annio, periodo, tipoCentro, ventasAcumuladas } = conciliaDWHInput;

            // obtener listado de las divisiones
            const _divisionesQuery =
                idCentro === 100 && tipoCentro === 1 ? await this._divisionesService.getDivisionesActivas() : await this._divisionesService.getDivisionById(idDivision);
            if (!_divisionesQuery.success) {
                return { success: false, error: _divisionesQuery.error };
            }
            const _divisiones = _divisionesQuery.data;

            for (let i = 0; i < _divisiones.length; i++) {
                const divisionInfo = _divisiones[i];

                // verificar si se ha definido la conexion al DWH
                const _conexionDWHQuery = await this._dwhConexionesService.DWHConexion(divisionInfo.IdDivision);
                if (!_conexionDWHQuery.success) {
                    return { success: false, error: _conexionDWHQuery.error + ' No se pudo obtener la Conexión al DWH de la División ' + divisionInfo.IdDivision };
                }
                if (!_conexionDWHQuery.data) {
                    return { success: false, error: `No se ha definido ninguna conexión de la División ${divisionInfo.IdDivision} a los DWH.` };
                }
                const _conexionDWH = _conexionDWHQuery.data;
                if (_conexionDWH.ConexionDWH === '') {
                    return { success: false, error: `No se ha definido la conexión al DWH de la División ${divisionInfo.IdDivision}.` };
                }
                if (_conexionDWH.ConexionRest === '') {
                    return { success: false, error: `No se ha definido la conexión al DWH de Restaura de la División ${divisionInfo.IdDivision}.` };
                }

                // verificar si se ha definido la conexión al Rodas
                const _conexionRodasQuery = await this._contaConexionesService.findByIdUnidad(tipoCentro === 0 ? idCentro : divisionInfo.IdDivision, tipoCentro === 1);
                const _conexionRodas = _conexionRodasQuery.data;
                _conexionRodas.BaseDatos = _conexionRodas.BaseDatos.substring(0, _conexionRodas.BaseDatos.length - 4) + annio.toString();

                // obtener listados de las unidades subordinadas
                let _unidadesQuery: UnidadesQueryResponse;
                switch (tipoCentro) {
                    case 0:
                        _unidadesQuery = await this._unidadesService.getUnidadesAbiertasByIdSubdivision(idCentro);
                        break;
                    case 1:
                        _unidadesQuery = await this._unidadesService.getUnidadesAbiertasByIdDivision(idCentro);
                        break;
                }
                if (!_unidadesQuery.success) {
                    return { success: false, error: _unidadesQuery.error };
                }
                const _unidades = _unidadesQuery.data;

                // importar datos del DWH
                const _importarDatosDWH = await this._importarDatosDWH(idCentro, annio, periodo, tipoCentro, ventasAcumuladas, _unidades, _conexionDWH);
                if (!_importarDatosDWH.success) {
                    return { success: false, error: _importarDatosDWH.error };
                }

                // importar datos del Rodas
                const _importarDatosRodas = await this._importarDatosRodas(annio, periodo, idCentro, tipoCentro, _conexionRodas);
                if (!_importarDatosRodas.success) {
                    return { success: false, error: _importarDatosRodas.error };
                }
            }

            // // obtener la información con los resultados de la conciliación
            // const _queryRodasDWHInventarioVentas = this._rodasDWHInventarioVentas(idCentro, tipoCentro, periodo);
            // const _queryRodasDWHAlmacenes = this._rodasDWHAlmacenes(idCentro, tipoCentro, periodo);
            // const _queryRodasDWHNota = this._rodasDWHNota(idCentro, annio, periodo);

            return new Promise<any>(resolve => {
                // calculo la conciliacion
                this._calculaConciliacion(idCentro, annio, periodo, tipoCentro, ventasAcumuladas)
                    // Promise.all([_queryRodasDWHInventarioVentas, _queryRodasDWHAlmacenes, _queryRodasDWHNota])
                    .then(results => {
                        resolve({
                            success: true,
                            data: results,
                        });
                    })
                    .catch(err => {
                        resolve({ success: false, error: err.message ? err.message : err });
                    });
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    private async _importarDatosDWH(
        idCentro: number,
        annio: number,
        mes: number,
        tipoCentro: number,
        ventasAcumuladas: boolean,
        unidades: Unidades[],
        dwhConexiones: DWHConexiones,
    ): Promise<MutationResponse> {
        let dwhConnectionDivision: DataSource;
        let dwhConnectionRestaurador: DataSource;
        let dwhConnectionEmpresa: DataSource;
        try {
            dwhConnectionDivision = await (await this._dwhConexionesService.conexionDWH(dwhConexiones.ConexionDWH.toString())).initialize();
            dwhConnectionRestaurador = await (await this._dwhConexionesService.conexionDWH(dwhConexiones.ConexionRest.toString())).initialize();
            dwhConnectionEmpresa = await (await this._dwhConexionesService.conexionRestEmpresa()).initialize();

            for (let index = 0; index < unidades.length; index++) {
                const unidadInfo = unidades[index];

                // elimino los datos de los almacenes
                const _deleteAlmacenesRes = await this._almacenesService.deleteAlmacenesByIdUnidad(unidadInfo.IdUnidad);
                if (!_deleteAlmacenesRes.success) {
                    throw new Error(_deleteAlmacenesRes.error + ' No se pudo borrar Almacenes de la Unidad ' + unidadInfo.IdUnidad);
                }

                // importo los almacenes
                let _importarAlmacenesRes = await this._importarAlmacenesDWH(unidadInfo.IdUnidad, dwhConnectionDivision);
                if (!_importarAlmacenesRes.success) {
                    throw new Error(_importarAlmacenesRes.error + ' No se pudo importar Almacenes de la Unidad ' + unidadInfo.IdUnidad);
                }

                // importo el inventario
                let _importarInventarioRes = await this._importarInventarioDWH(idCentro, annio, mes, unidadInfo, tipoCentro, dwhConnectionDivision);
                if (!_importarInventarioRes.success) {
                    throw new Error(_importarInventarioRes.error + ' No se pudo importar Inventario DWH de la Unidad ' + unidadInfo.IdUnidad);
                }

                _importarInventarioRes = await this._importarInventarioDWH(idCentro, annio, mes, unidadInfo, tipoCentro, dwhConnectionRestaurador, true);
                if (!_importarInventarioRes.success) {
                    throw new Error(_importarInventarioRes.error + ' No se pudo importar Inventario DWH de la Unidad ' + unidadInfo.IdUnidad);
                }

                // importo las ventas
                let _importarVentasRes = await this._importarVentasDWH(idCentro, annio, mes, unidadInfo, tipoCentro, ventasAcumuladas, dwhConnectionDivision);
                if (!_importarVentasRes.success) {
                    throw new Error(_importarVentasRes.error + ' No se pudo importar Ventas DWH de la Unidad ' + unidadInfo.IdUnidad);
                }

                _importarVentasRes = await this._importarVentasDWH(idCentro, annio, mes, unidadInfo, tipoCentro, ventasAcumuladas, dwhConnectionRestaurador, true);
                if (!_importarVentasRes.success) {
                    throw new Error(_importarVentasRes.error + ' No se pudo importar Ventas DWH de la Unidad ' + unidadInfo.IdUnidad);
                }

                // importo de la Empresa
                _importarAlmacenesRes = await this._importarAlmacenesDWH(unidadInfo.IdUnidad, dwhConnectionEmpresa, true);
                if (!_importarAlmacenesRes.success) {
                    throw new Error(_importarAlmacenesRes.error + ' No se pudo importar Almacenes DWH de la Unidad ' + unidadInfo.IdUnidad);
                }

                _importarInventarioRes = await this._importarInventarioDWH(idCentro, annio, mes, unidadInfo, tipoCentro, dwhConnectionEmpresa, false, true);
                if (!_importarInventarioRes.success) {
                    throw new Error(_importarInventarioRes.error + ' No se pudo importar Inventario DWH Empresa de la Unidad ' + unidadInfo.IdUnidad);
                }

                _importarVentasRes = await this._importarVentasDWH(idCentro, annio, mes, unidadInfo, tipoCentro, ventasAcumuladas, dwhConnectionEmpresa, false, true);
                if (!_importarVentasRes.success) {
                    throw new Error(_importarVentasRes.error + ' No se pudo importar Ventas DWH Empresa de la Unidad ' + unidadInfo.IdUnidad);
                }
            }

            // if (dwhConnectionDivision && dwhConnectionDivision.isInitialized) dwhConnectionDivision.destroy();
            // if (dwhConnectionDivision && dwhConnectionRestaurador.isInitialized) dwhConnectionRestaurador.destroy();
            // if (dwhConnectionDivision && dwhConnectionEmpresa.isInitialized) dwhConnectionEmpresa.destroy();

            return new Promise<MutationResponse>(resolve => {
                resolve({ success: true });
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    private async _importarAlmacenesDWH(idUnidad: number, connection: DataSource, isDistribuidor = false): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>(resolve => {
                connection
                    .query(
                        `SELECT IdGerenciaIdAlmacen, IdUnidad, Almacen, ISNULL(IdPiso, 0) AS IdPiso, ISNULL(EContable, '') AS EContable, ISNULL(EContableMN, '') AS EContableMN, ISNULL(Abierto, 0) AS Abierto, ISNULL(Exhibicion, 0) AS Exhibicion,
                ISNULL(Interno, 0) AS Interno, ISNULL(Merma, 0) AS Merma, ISNULL(Gastronomia, 0) AS Gastronomia, ISNULL(Insumo, 0) AS Insumo, ISNULL(Inversiones, 0) AS Inversiones, ISNULL(Boutique, 0) AS Boutique,
                ISNULL(MermaOrigen, 0) AS MermaOrigen, ISNULL(Consignacion, 0) AS Consignacion, ISNULL(Emergente, 0) AS Emergente, ISNULL(ReservaDiv, 0) AS ReservaDiv, ISNULL(ReservaNac, 0) AS ReservaNac,
                ISNULL(DespachoDiv, 0) AS DespachoDiv, ISNULL(OrigenReplica, 0) AS OrigenReplica, ISNULL(DestinoReplica, 0) AS DestinoReplica, ISNULL(CapacidadFrio, 0) AS CapacidadFrio, ISNULL(Ociosos, 0) AS Ociosos,
                ISNULL(LentoMov, 0) AS LentoMov, ISNULL(MercanciaVenta, 0) AS MercanciaVenta
                FROM            UnidadesComerciales.dbo.Almacenes
                WHERE        (IdUnidad = ${idUnidad})`,
                    )
                    .then(async result => {
                        if (result) {
                            const _almacenes = this._xmlSvc.jsonToXML('Almacenes', result);

                            await this.connection
                                .query(`EXEC dbo.pDWH_ImportAlmacenesXML @0, @1, @2`, [_almacenes, idUnidad, isDistribuidor ? 1 : 0])
                                .then(() => {
                                    resolve({ success: true });
                                })
                                .catch(err => {
                                    throw new Error(err.message ? err.message : err);
                                });
                        }
                    })
                    .catch(err => {
                        return { success: false, error: err.message ? err.message : err };
                    });
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    private async _importarInventarioDWH(
        idCentro: number,
        annio: number,
        mes: number,
        unidadInfo: Unidades,
        tipoCentro: number,
        connection: DataSource,
        isRestaura = false,
        isDistribuidor = false,
    ): Promise<MutationResponse> {
        try {
            const query = queryInventarioDWH
                .replace(/@Anio/g, annio.toString())
                .replace(/@Mes/g, mes.toString())
                .replace(/@Centro/g, idCentro.toString())
                .replace(/@Unidad/g, unidadInfo.IdUnidad.toString())
                .replace(/@Cons/g, tipoCentro.toString());

            return new Promise<MutationResponse>(resolve => {
                resolve({ success: true });
                connection.query(query).then(async result => {
                    if (result) {
                        const _inventario = this._xmlSvc.jsonToXML('DWH', result);

                        await this.connection
                            .query(`EXEC dbo.pDWH_ImportInventarioXML @0, @1, @2, @3, @4, @5`, [
                                _inventario,
                                idCentro,
                                mes,
                                tipoCentro === 1,
                                isRestaura ? 1 : 0,
                                isDistribuidor ? 1 : 0,
                            ])
                            .then(() => {
                                resolve({ success: true });
                            })
                            .catch(err => {
                                throw new Error(err.message ? err.message : err);
                            });
                    }
                });
            }).catch(err => {
                return { success: false, error: err.message ? err.message : err };
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    private async _importarVentasDWH(
        idCentro: number,
        annio: number,
        mes: number,
        unidadInfo: Unidades,
        tipoCentro: number,
        ventasAcumuladas: boolean,
        connection: DataSource,
        isRestaura = false,
        isDistribuidor = false,
    ): Promise<MutationResponse> {
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

            return new Promise<MutationResponse>(resolve => {
                resolve({ success: true });
                connection.query(query).then(async result => {
                    if (result) {
                        const _ventas = this._xmlSvc.jsonToXML('DWH', result);

                        await this.connection
                            .query(`EXEC dbo.pDWH_ImportVentasXML @0, @1, @2, @3, @4, @5`, [_ventas, idCentro, mes, tipoCentro === 1, isRestaura ? 1 : 0, isDistribuidor ? 1 : 0])
                            .then(() => {
                                resolve({ success: true });
                            })
                            .catch(err => {
                                throw new Error(err.message ? err.message : err);
                            });
                    }
                });
            }).catch(err => {
                return { success: false, error: err.message ? err.message : err };
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    private async _importarDatosRodas(annio: number, periodo: number, idUnidad: number, tipoCentro: number, contaConexion: ContaConexiones): Promise<MutationResponse> {
        try {
            const cons = tipoCentro === 1 ? '1' : '0';

            // me conecto al Rodas del Centro
            const rodasConnection = await this._contaConexionesService.conexionRodas(contaConexion);

            // importo los asientos del rodas
            await this._conciliaContaService.importarContabilidad(idUnidad, annio, periodo, cons, rodasConnection);
            // if (!_importarAsientoRodas.success) {
            //     return { success: false, error: _importarAsientoRodas.error + ' No se pudo importar Asientos del Rodas de la Unidad ' + idUnidad };
            // }

            return new Promise<MutationResponse>(resolve => {
                if (rodasConnection.isInitialized) rodasConnection.destroy();
                resolve({ success: true });
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    private async _calculaConciliacion(idUnidad: number, annio: number, periodo: number, tipoCentro: number, ventasAcumuladas: boolean): Promise<any> {
        const cons = tipoCentro === 1 ? '1' : '0';

        return new Promise<any>((resolve, reject) => {
            // calculo el inventario y la venta
            this.connection
                .query(`EXEC dbo.pDWH_CalculaConciliacion @0, @1, @2, @3, @4`, [cons, idUnidad, annio, periodo, ventasAcumuladas ? 1 : 0])
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    throw new Error(err.message ? err.message : err);
                });
        });
    }
}
