import { DivisionesService } from './../divisiones/divisiones.service';
import { ConciliaContaService } from './../concilia-conta/concilia-conta.service';
import { ContaConexionesService } from './../conta-conexiones/conta-conexiones.service';
import { DWHVentas } from './../dwh-ventas/dwh-ventas.entity';
import { DWHInventario } from './../dwh-inventario/dwh-inventario.entity';
import { Almacenes } from './../almacenes/almacenes.entity';
import { AlmacenesService } from './../almacenes/almacenes.service';
import { DWHConexiones } from './../dwh-conexiones/dwh-conexiones.entity';
import { Unidades } from './../unidades/unidades.entity';
import { DwhConexionesService } from './../dwh-conexiones/dwh-conexiones.service';
import { UnidadesService } from './../unidades/unidades.service';
import { RodasVentasService } from './../rodas-ventas/rodas-ventas.service';
import { DwhVentasService } from './../dwh-ventas/dwh-ventas.service';
import { ConciliaDWHInput, queryInventarioDWH, queryRodasDWHInventarioVentas, queryRodasDWHInventarioVentasResumen, queryVentasDWH, ConciliaDWHQueryResponse, RodasDWHQueryResponse, queryRodasDWHAlmacenes, queryRodasDWHAlmacenesDist, queryRodasDWHNota } from './concilia-dwh.model';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { DwhInventarioService } from './../dwh-inventario/dwh-inventario.service';
import { Injectable } from '@nestjs/common';
import { RodasInventarioService } from 'src/rodas-inventario/rodas-inventario.service';
import { UnidadesQueryResponse } from 'src/unidades/unidades.model';
import { Connection } from 'typeorm';
import { ContaConexiones } from 'src/conta-conexiones/conta-conexiones.entity';
import { InjectConnection } from '@nestjs/typeorm';

@Injectable()
export class ConciliaDwhService {
    constructor(
        @InjectConnection() private readonly connection: Connection,
        private _dwhInventarioService: DwhInventarioService,
        private _dwhVentasService: DwhVentasService,
        private _rodasInventarioService: RodasInventarioService,
        private _rodasVentasService: RodasVentasService,
        private _unidadesService: UnidadesService,
        private _dwhConexionesService: DwhConexionesService,
        private _contaConexionesService: ContaConexionesService,
        private _almacenesService: AlmacenesService,
        private _conciliaContaService: ConciliaContaService,
        private _divisionesService: DivisionesService,
    ) {}

    async conciliaDWH(conciliaDWHInput: ConciliaDWHInput): Promise<any> {
        try {
            const { idDivision, idCentro, annio, periodo, tipoCentro, ventasAcumuladas } = conciliaDWHInput;

            // obtener listado de las divisiones
            const _divisionesQuery = idCentro === 100 && tipoCentro === 1 ?
                                await this._divisionesService.getDivisionesActivas() :
                                await this._divisionesService.getDivisionById(idDivision);
            if (!_divisionesQuery.success) {
                return { success: false, error: _divisionesQuery.error };
            }
            const _divisiones = _divisionesQuery.data;

            for (let i = 0; i < _divisiones.length; i++) {
                const divisionInfo = _divisiones[i];

                // verificar si se ha definido la conexion al DWH
                const _conexionDWHQuery = await this._dwhConexionesService.DWHConexion(divisionInfo.IdDivision);
                if (!_conexionDWHQuery.success) {
                    return { success: false, error: _conexionDWHQuery.error  + ' No se pudo obtener la Conexión al DWH de la División ' + divisionInfo.IdDivision };
                }
                if (!_conexionDWHQuery.data) {
                    return { success: false, error: `No se ha definido ninguna conexión de la División ${ divisionInfo.IdDivision } a los DWH.` };
                }
                const _conexionDWH = _conexionDWHQuery.data;
                if (_conexionDWH.ConexionDWH === '') {
                    return { success: false, error: `No se ha definido la conexión al DWH de la División ${ divisionInfo.IdDivision }.` };
                }
                if (_conexionDWH.ConexionRest === '') {
                    return { success: false, error: `No se ha definido la conexión al DWH de Restaura de la División ${ divisionInfo.IdDivision }.` };
                }

                // verificar si se ha definido la conexión al Rodas
                const _conexionRodasQuery = await this._contaConexionesService.findByIdUnidad(tipoCentro === 0 ? idCentro : divisionInfo.IdDivision, tipoCentro === 1);
                const _conexionRodas = _conexionRodasQuery.data;
                _conexionRodas.BaseDatos = _conexionRodas.BaseDatos.substring(0, _conexionRodas.BaseDatos.length - 4) + annio.toString();

                // borrar datos
                await this._deleteValues(idCentro, periodo);
                
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
                const _importarDatosRodas = await this._importarDatosRodas(annio, periodo, idCentro, tipoCentro, _conexionRodas, ventasAcumuladas);
                if (!_importarDatosRodas.success) {
                    return { success: false, error: _importarDatosRodas.error };
                }
            }

            // obtener la información con los resultados de la conciliación
            const _queryRodasDWHInventarioVentas = this._rodasDWHInventarioVentas(idCentro, tipoCentro, periodo, ventasAcumuladas);
            const _queryRodasDWHAlmacenes = this._rodasDWHAlmacenes(idCentro, tipoCentro, periodo);
            const _queryRodasDWHNota = this._rodasDWHNota(idCentro, annio, periodo);

            return new Promise<any>((resolve) => {
                Promise.all([_queryRodasDWHInventarioVentas, _queryRodasDWHAlmacenes, _queryRodasDWHNota]).then(results => {
                    resolve({
                        success: true,
                        data: {
                            RodasDWHInventarioVentas: results[0],
                            RodasDWHAlmacenes: results[1],
                            RodasDWHNota: results[2]
                        }
                    });
                }).catch(err => {
                    resolve({success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    private async _deleteValues(idCentro: number, periodo: number, ): Promise<void> {
        // borrar datos
        const deletedDWHInventario = this._dwhInventarioService.deleteDWHInventario(idCentro, periodo);
        const deletedDWHVentas = this._dwhVentasService.deleteDWHVentas(idCentro, periodo);
        const deletedRodasInventario = this._rodasInventarioService.deleteRodasInventario(idCentro, periodo);
        const deletedRodasVentas = this._rodasVentasService.deleteRodasVentas(idCentro, periodo);

        let errorOnDelete = '';

        await Promise.all([deletedDWHInventario, deletedDWHVentas, deletedRodasInventario, deletedRodasVentas]).then(response => {
            response.map(res => {
                if (!res.success) {
                    errorOnDelete = res.error.toString();
                }
            });
        });

        if (errorOnDelete !== '') {
            throw new Error(errorOnDelete);
        }
    }

    private async _importarDatosDWH(idCentro: number, annio: number, mes: number, tipoCentro: number, ventasAcumuladas: boolean, unidades: Unidades[], dwhConexiones: DWHConexiones): Promise<MutationResponse> {
        let dwhConnectionDivision: Connection;
        let dwhConnectionRestaurador: Connection;
        let dwhConnectionEmpresa: Connection;
        try {
            dwhConnectionDivision = await (await this._dwhConexionesService.conexionDWH(dwhConexiones.ConexionDWH.toString())).connect();
            dwhConnectionRestaurador = await (await this._dwhConexionesService.conexionDWH(dwhConexiones.ConexionRest.toString())).connect();
            dwhConnectionEmpresa = await (await this._dwhConexionesService.conexionRestEmpresa()).connect();

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

                _importarInventarioRes = await this._importarInventarioDWH(idCentro, annio, mes, unidadInfo, tipoCentro, dwhConnectionEmpresa, null, true);
                if (!_importarInventarioRes.success) {
                    throw new Error(_importarInventarioRes.error + ' No se pudo importar Inventario DWH Empresa de la Unidad ' + unidadInfo.IdUnidad);
                }

                _importarVentasRes = await this._importarVentasDWH(idCentro, annio, mes, unidadInfo, tipoCentro, ventasAcumuladas, dwhConnectionEmpresa, null, true);
                if (!_importarVentasRes.success) {
                    throw new Error(_importarVentasRes.error + ' No se pudo importar Ventas DWH Empresa de la Unidad ' + unidadInfo.IdUnidad);
                }
            }

            if (dwhConnectionDivision && dwhConnectionDivision.isConnected)
                dwhConnectionDivision.close();
            if (dwhConnectionDivision && dwhConnectionRestaurador.isConnected)
                dwhConnectionRestaurador.close();
            if (dwhConnectionDivision && dwhConnectionEmpresa.isConnected)
                dwhConnectionEmpresa.close();

            return new Promise<MutationResponse>(resolve => {
                resolve({ success: true });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    private async _importarAlmacenesDWH(idUnidad: number, connection: Connection, isDistribuidor = false): Promise<MutationResponse> {
        try {
            const _almacenes: Almacenes[] = await connection.query(`SELECT IdGerenciaIdAlmacen, IdUnidad, Almacen, ISNULL(IdPiso, 0) AS IdPiso, ISNULL(EContable, '') AS EContable, ISNULL(EContableMN, '') AS EContableMN, ISNULL(Abierto, 0) AS Abierto, ISNULL(Exhibicion, 0) AS Exhibicion,
                ISNULL(Interno, 0) AS Interno, ISNULL(Merma, 0) AS Merma, ISNULL(Gastronomia, 0) AS Gastronomia, ISNULL(Insumo, 0) AS Insumo, ISNULL(Inversiones, 0) AS Inversiones, ISNULL(Boutique, 0) AS Boutique,
                ISNULL(MermaOrigen, 0) AS MermaOrigen, ISNULL(Consignacion, 0) AS Consignacion, ISNULL(Emergente, 0) AS Emergente, ISNULL(ReservaDiv, 0) AS ReservaDiv, ISNULL(ReservaNac, 0) AS ReservaNac,
                ISNULL(DespachoDiv, 0) AS DespachoDiv, ISNULL(OrigenReplica, 0) AS OrigenReplica, ISNULL(DestinoReplica, 0) AS DestinoReplica, ISNULL(CapacidadFrio, 0) AS CapacidadFrio, ISNULL(Ociosos, 0) AS Ociosos,
                ISNULL(LentoMov, 0) AS LentoMov, ISNULL(MercanciaVenta, 0) AS MercanciaVenta
                FROM            UnidadesComerciales.dbo.Almacenes
                WHERE        (IdUnidad = ${ idUnidad })`).then(result => {
                    return result;
                }).catch(err => {
                    return { success: false, error: err.message ? err.message : err };
                });

            if (_almacenes) {
                for (let i = 0; i < _almacenes.length; i++) {
                    const almacen = _almacenes[i];
                    almacen.Distribuidor = isDistribuidor;

                    const _insertAlmacenRes = await this._almacenesService.insertAlmacenes(almacen);
                    if (!_insertAlmacenRes.success) {
                        return { success: false, error: _insertAlmacenRes.error };
                    }
                }
            }

            return new Promise<MutationResponse>(resolve => {
                resolve({ success: true });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    private async _importarInventarioDWH(idCentro: number, annio: number, mes: number, unidadInfo: Unidades, tipoCentro: number, connection: Connection, isRestaura = false, isDistribuidor = false): Promise<MutationResponse> {
        try {
            const query = queryInventarioDWH.replace(/@Anio/g, annio.toString())
                                            .replace(/@Mes/g, mes.toString())
                                            .replace(/@Centro/g, idCentro.toString())
                                            .replace(/@Unidad/g, unidadInfo.IdUnidad.toString())
                                            .replace(/@Cons/g, tipoCentro.toString());

            const _inventario: DWHInventario[] = await connection.query(query).then(result => {
                return result;
            }).catch(err => {
                return { success: false, error: err.message ? err.message : err };
            });

            if (_inventario) {
                for (let i = 0; i < _inventario.length; i++) {
                    const inventario = _inventario[i];

                    if (tipoCentro === 1) {
                        inventario.IdUnidad = unidadInfo.IdComplejo === 0 ? unidadInfo.IdUnidad : unidadInfo.IdComplejo;
                    }

                    if (isRestaura) {
                        inventario.SaldoRest = inventario.Saldo;
                        inventario.SaldoDist = 0;
                        inventario.Saldo = 0;
                    }
                    if (isDistribuidor) {
                        inventario.SaldoDist = inventario.Saldo;
                        inventario.SaldoRest = 0;
                        inventario.Saldo = 0;
                    }

                    const _insertAlmacenRes = await this._dwhInventarioService.insertDWHInventario(inventario);
                    if (!_insertAlmacenRes.success) {
                        return { success: false, error: _insertAlmacenRes.error };
                    }
                }
            }

            return new Promise<MutationResponse>(resolve => {
                resolve({ success: true });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    private async _importarVentasDWH(idCentro: number, annio: number, mes: number, unidadInfo: Unidades, tipoCentro: number, ventasAcumuladas: boolean, connection: Connection, isRestaura = false, isDistribuidor = false): Promise<MutationResponse> {
        try {
            let query = queryVentasDWH;

            if (ventasAcumuladas) {
                query = query.replace(/= @Mes/g, '<= @Mes');
            }

            query = query.replace(/@Anio/g, annio.toString())
                        .replace(/@Mes/g, mes.toString())
                        .replace(/@Centro/g, idCentro.toString())
                        .replace(/@Unidad/g, unidadInfo.IdUnidad.toString())
                        .replace(/@Cons/g, tipoCentro.toString());

            const _ventas: DWHVentas[] = await connection.query(query).then(result => {
                return result;
            }).catch(err => {
                return { success: false, error: err.message ? err.message : err };
            });

            if (_ventas) {
                for (let i = 0; i < _ventas.length; i++) {
                    const venta = _ventas[i];

                    if (tipoCentro === 1) {
                        venta.IdUnidad = unidadInfo.IdComplejo === 0 ? unidadInfo.IdUnidad : unidadInfo.IdComplejo;
                    }

                    if (isRestaura) {
                        venta.SaldoRest = venta.Saldo;
                        venta.SaldoDist = 0;
                        venta.Saldo = 0;
                    }
                    if (isDistribuidor) {
                        venta.SaldoDist = venta.Saldo;
                        venta.SaldoRest = 0;
                        venta.Saldo = 0;
                    }

                    const _insertAlmacenRes = await this._dwhVentasService.insertDWHVentas(venta);
                    if (!_insertAlmacenRes.success) {
                        return { success: false, error: _insertAlmacenRes.error };
                    }
                }
            }

            return new Promise<MutationResponse>(resolve => {
                resolve({ success: true });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    private async _importarDatosRodas(annio: number, periodo: number, idUnidad: number, tipoCentro: number, rodasConexion: ContaConexiones, ventasAcumuladas: boolean): Promise<MutationResponse> {
        try {
            const cons = tipoCentro === 1 ? '1' : '0';
            // importo los asientos del rodas
            await this._conciliaContaService.importarContabilidad(idUnidad, annio, periodo, cons, rodasConexion);
            // if (!_importarAsientoRodas.success) {
            //     return { success: false, error: _importarAsientoRodas.error + ' No se pudo importar Asientos del Rodas de la Unidad ' + idUnidad };
            // }

            // importo el inventario
            const _importarInventarioRes = await this._conciliaContaService.importarInventarioRodas(annio, periodo, idUnidad, cons);
            if (!_importarInventarioRes.success) {
                return { success: false, error: _importarInventarioRes.error + ' No se pudo importar Inventario del Rodas de la Unidad ' + idUnidad };
            }

            // importo las ventas
            const _importarVentasRes = await this._conciliaContaService.importarVentasRodas(annio, periodo, idUnidad, cons, ventasAcumuladas);
            if (!_importarVentasRes.success) {
                return { success: false, error: _importarVentasRes.error + ' No se pudo importar Ventas del Rodas de la Unidad ' + idUnidad };
            }

            return new Promise<MutationResponse>(resolve => {
                resolve({ success: true });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    private async _rodasDWHInventarioVentas(idUnidad: number, tipoCentro: number, periodo: number, acum: boolean): Promise<RodasDWHQueryResponse> {
        try {
            const _query = tipoCentro === 0 ?
                queryRodasDWHInventarioVentas
                    .replace(/@IdCentro/g, idUnidad.toString())
                    .replace(/@Periodo/g, periodo.toString()) :
                queryRodasDWHInventarioVentasResumen
                    .replace(/@IdCentro/g, idUnidad.toString())
                    .replace(/@Periodo/g, periodo.toString());

            return new Promise<RodasDWHQueryResponse>(resolve => {
                this.connection.query(_query).then(result => {
                    resolve({
                        success: true,
                        data: JSON.stringify(result)
                    });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    private async _rodasDWHAlmacenes(idUnidad: number, tipoCentro: number, periodo: number): Promise<RodasDWHQueryResponse> {
        try {
            const _query = tipoCentro === 0 ?
                queryRodasDWHAlmacenes
                    .replace(/@IdCentro/g, idUnidad.toString())
                    .replace(/@Periodo/g, periodo.toString()) :
                queryRodasDWHAlmacenesDist
                    .replace(/@IdCentro/g, idUnidad.toString())
                    .replace(/@Periodo/g, periodo.toString());

            return new Promise<RodasDWHQueryResponse>(resolve => {
                this.connection.query(_query).then(result => {
                    resolve({
                        success: true,
                        data: JSON.stringify(result)
                    });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    private async _rodasDWHNota(idUnidad: number, annio: number, periodo: number): Promise<RodasDWHQueryResponse> {
        try {
            const _query = queryRodasDWHNota.replace(/@IdCentro/g, idUnidad.toString())
                                            .replace(/@Anio/g, annio.toString())
                                            .replace(/@Periodo/g, periodo.toString());

            return new Promise<RodasDWHQueryResponse>(resolve => {
                this.connection.query(_query).then(result => {
                    resolve({
                        success: true,
                        data: JSON.stringify(result)
                    });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

}
