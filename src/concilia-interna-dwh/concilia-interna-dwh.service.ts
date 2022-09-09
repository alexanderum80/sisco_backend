import { DwhConexionesService } from './../dwh-conexiones/dwh-conexiones.service';
import { ConciliacionInternaDWHQueryResponse, queryConciliaInternaDWH, ConciliaInternaDWHInput, filtroInternaEmisor, soloDiferencias, filtroInternaReceptor } from './concilia-interna-dwh.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConciliaInternaDwhService {
    constructor(
        private _dwhConexionSvc: DwhConexionesService
    ) {}

    async conciliaInternaDWH(inputValues: ConciliaInternaDWHInput): Promise<ConciliacionInternaDWHQueryResponse> {
        try {
            inputValues.FechaInicial = inputValues.FechaInicial.substr(0, 10).replace(/-/g, '');
            inputValues.FechaFinal = inputValues.FechaFinal.substr(0, 10).replace(/-/g, '');

            const _filtroInternaEmisor = filtroInternaEmisor.replace('@FechaInicial', inputValues.FechaInicial)
                                        .replace(/@FechaFinal/g, inputValues.FechaFinal)
                                        .replace(/@IdDivisionA/g, inputValues.IdDivision.toString())
                                        .replace(/@IdSubdivisionA/g, inputValues.IdSubdivision.toString())
                                        .replace(/@IdUnidadA/g, inputValues.IdUnidad.toString())
                                        .replace(/@IdDivisionO/g, inputValues.IdDivisionOD.toString())
                                        .replace(/@IdSubdivisionO/g, inputValues.IdSubdivisionOD.toString())
                                        .replace(/@IdUnidadO/g, inputValues.IdUnidadOD.toString());

            const _filtroInternaReceptor = filtroInternaReceptor.replace('@FechaInicial', inputValues.FechaInicial)
                                        .replace(/@FechaFinal/g, inputValues.FechaFinal)
                                        .replace(/@IdDivisionA/g, inputValues.IdDivision.toString())
                                        .replace(/@IdSubdivisionA/g, inputValues.IdSubdivision.toString())
                                        .replace(/@IdUnidadA/g, inputValues.IdUnidad.toString())
                                        .replace(/@IdDivisionO/g, inputValues.IdDivisionOD.toString())
                                        .replace(/@IdSubdivisionO/g, inputValues.IdSubdivisionOD.toString())
                                        .replace(/@IdUnidadO/g, inputValues.IdUnidadOD.toString());

            const _filtroSoloDiferencias = inputValues.SoloDiferencias ? soloDiferencias : '';

            const queryDWH = queryConciliaInternaDWH.replace('@FiltroInternaEmisor', _filtroInternaEmisor)
                                                    .replace('@FiltroInternaReceptor', _filtroInternaReceptor)
                                                    .replace('@FiltroSoloDiferencias', _filtroSoloDiferencias);

            const conexionResp = await this._dwhConexionSvc.DWHConexion(inputValues.IdDivision);
            if (!conexionResp.success) {
                return { success: false, error: conexionResp.error!.toString() };
            }

            const conexion = await (await this._dwhConexionSvc.conexionDWH(conexionResp.data!.ConexionRest!)).initialize();

            return new Promise<ConciliacionInternaDWHQueryResponse>(resolve => {
                conexion.query(queryDWH).then(res => {
                    resolve({
                        success: true,
                        data: res
                    });
                }).catch(err => {
                    return { success: false, error: err.message ? err.message : err };
                });
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }
}
