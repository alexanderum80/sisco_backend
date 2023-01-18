import { queryConciliaOperacionesDWH, ConciliaOperacionesDWHInput, ConciliacionOperacionesDWHQueryResponse } from './../shared/models/query-operaciones-dwh.model';
import { DwhConexionesService } from './../dwh-conexiones/dwh-conexiones.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConciliaInternaDwhService {
  constructor(private _dwhConexionSvc: DwhConexionesService) {}

  async conciliaInternaDWH(inputValues: ConciliaOperacionesDWHInput): Promise<ConciliacionOperacionesDWHQueryResponse> {
    try {
      inputValues.FechaInicial = inputValues.FechaInicial.substring(0, 10).replace(/-/g, '');
      inputValues.FechaFinal = inputValues.FechaFinal.substring(0, 10).replace(/-/g, '');

      const queryDWH = queryConciliaOperacionesDWH
        .replace(/@FechaInicial/g, inputValues.FechaInicial)
        .replace(/@FechaFinal/g, inputValues.FechaFinal)
        .replace(/@IdDivisionA/g, inputValues.IdDivision.toString())
        .replace(/@IdSubdivisionA/g, inputValues.IdSubdivision.toString())
        .replace(/@IdUnidadA/g, inputValues.IdUnidad.toString())
        .replace(/@IdDivisionO/g, inputValues.IdDivisionOD.toString())
        .replace(/@IdSubdivisionO/g, inputValues.IdSubdivisionOD.toString())
        .replace(/@IdUnidadO/g, inputValues.IdUnidadOD.toString());

      const conexionResp = await this._dwhConexionSvc.DWHConexion(inputValues.IdDivision);
      if (!conexionResp.success) {
        return { success: false, error: conexionResp.error.toString() };
      }

      const conexion = await (await this._dwhConexionSvc.conexionDWH(conexionResp.data.ConexionRest)).initialize();

      return new Promise<ConciliacionOperacionesDWHQueryResponse>(resolve => {
        conexion
          .query(queryDWH)
          .then(res => {
            resolve({
              success: true,
              data: res,
            });
          })
          .catch(err => {
            return { success: false, error: err.message ? err.message : err };
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }
}
