import { DataSource } from 'typeorm';
import { UnidadesService } from './../unidades/unidades.service';
import { DwhConexionesService } from './../dwh-conexiones/dwh-conexiones.service';
import { Injectable } from '@nestjs/common';
import { queryParteAtrasos, queryDatosIdGAM } from './parte-atraso.model';
import { join } from 'lodash';

@Injectable()
export class ParteAtrasoService {
    constructor(private _dwhConexionesService: DwhConexionesService, private _unidadesService: UnidadesService) {}

    async parteAtrasos(idDivision: number): Promise<any> {
        try {
            // obtener la conexion de los DWH de la Empresa
            const dwhConnectionDistEmpresa = await (await this._dwhConexionesService.conexionRestEmpresa()).initialize();
            const dwhConnectionDWHEmpresa = await (await this._dwhConexionesService.conexionDWHEmpresa()).initialize();

            const parteAtrasos: any[] = [];

            // obtener la conexion al DWH
            const _conexionDWHQuery = await this._dwhConexionesService.DWHConexion(idDivision);
            if (!_conexionDWHQuery.success) {
                return { success: false, error: _conexionDWHQuery.error + ' No se pudo obtener la Conexión al DWH de la División ' + idDivision };
            }
            if (!_conexionDWHQuery.data) {
                return { success: false, error: `No se ha definido ninguna conexión de la División ${idDivision} a los DWH.` };
            }
            const _conexionDWH = _conexionDWHQuery.data;
            const dwhConnectionRest = await (await this._dwhConexionesService.conexionDWH(_conexionDWH.ConexionRest!.toString())).initialize();
            const dwhConnectionDWH = await (await this._dwhConexionesService.conexionDWH(_conexionDWH.ConexionDWH!.toString())).initialize();

            // obtener listados de las unidades subordinadas
            const _unidadesQuery = await this._unidadesService.getUnidadesAbiertasByIdDivision(idDivision);
            if (!_unidadesQuery.success) {
                return { success: false, error: _unidadesQuery.error };
            }
            const _unidades = _unidadesQuery.data;

            const _getParteAtrasosRest = this._getParteAtrasos(dwhConnectionRest, _unidades);
            const _getParteAtrasosDWH = this._getParteAtrasos(dwhConnectionDWH, _unidades);
            const _getParteAtrasosDist = this._getParteAtrasos(dwhConnectionDistEmpresa, _unidades);
            const _getParteAtrasosEmp = this._getParteAtrasos(dwhConnectionDWHEmpresa, _unidades);

            await Promise.all([_getParteAtrasosRest, _getParteAtrasosDWH, _getParteAtrasosDist, _getParteAtrasosEmp]).then(results => {
                for (let i = 0; i < _unidades.length; i++) {
                    const unidad = _unidades[i];
                    const parteUnidad = {
                        IdUnidad: unidad.IdUnidad,
                        Unidad: unidad.IdUnidad + '-' + unidad.Nombre,
                        IdDivision: unidad.IdDivision,
                        Division: unidad.IdDivision + '-' + unidad.Division,
                        AtrasoRest: 0,
                        AtrasoDWH: 0,
                        AtrasoDist: 0,
                        AtrasoEmp: 0,
                    };

                    const atrasoRest = results[0].data?.find((f: any) => f.IdUnidad === unidad.IdUnidad);
                    if (atrasoRest) {
                        parteUnidad.AtrasoRest = atrasoRest.Atraso;
                    }

                    const atrasoDWH = results[1].data?.find((f: any) => f.IdUnidad === unidad.IdUnidad);
                    if (atrasoDWH) {
                        parteUnidad.AtrasoDWH = atrasoDWH.Atraso;
                    }

                    const atrasoDist = results[2].data?.find((f: any) => f.IdUnidad === unidad.IdUnidad);
                    if (atrasoDist) {
                        parteUnidad.AtrasoDist = atrasoDist.Atraso;
                    }

                    const atrasoEmp = results[3].data?.find((f: any) => f.IdUnidad === unidad.IdUnidad);
                    if (atrasoEmp) {
                        parteUnidad.AtrasoEmp = atrasoEmp.Atraso;
                    }

                    parteAtrasos.push(parteUnidad);
                }
            });

            return new Promise<any>(resolve => {
                resolve({
                    success: true,
                    data: JSON.stringify(parteAtrasos),
                });
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    private async _getParteAtrasos(dataSource: DataSource, unidades: any): Promise<any> {
        try {
            const _query =
                queryParteAtrasos +
                ` HAVING UC.IdUnidad IN (${join(
                    unidades.map((u: { IdUnidad: number }) => u.IdUnidad),
                    ', ',
                )})`;

            return new Promise<any>(resolve => {
                dataSource
                    .query(_query)
                    .then(result => {
                        resolve({
                            success: true,
                            data: result,
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

    // Obtener los IdGAM
    async datosIdGAM(idDivision: number): Promise<any> {
        try {
            // obtener listados de las unidades subordinadas
            const _unidadesQuery = await this._unidadesService.getUnidadesAbiertasByIdDivision(idDivision);
            if (!_unidadesQuery.success) {
                return { success: false, error: _unidadesQuery.error };
            }
            const _unidades = _unidadesQuery.data;

            // obtener la conexion al DWH
            const _conexionDWHQuery = await this._dwhConexionesService.DWHConexion(idDivision);
            if (!_conexionDWHQuery.success) {
                return { success: false, error: _conexionDWHQuery.error + ' No se pudo obtener la Conexión al DWH de la División ' + idDivision };
            }
            if (!_conexionDWHQuery.data) {
                return { success: false, error: `No se ha definido ninguna conexión de la División ${idDivision} a los DWH.` };
            }
            const _conexionDWH = _conexionDWHQuery.data;
            const dwhConnectionRest = await (await this._dwhConexionesService.conexionDWH(_conexionDWH.ConexionRest!.toString())).initialize();

            return new Promise<any>(resolve => {
                const _query =
                    queryDatosIdGAM.replace('@Annio', new Date().getFullYear().toString()) +
                    ` AND IdGerencia IN (${join(
                        _unidades.map((u: { IdUnidad: number }) => u.IdUnidad),
                        ', ',
                    )})`;
                dwhConnectionRest
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
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }
}
