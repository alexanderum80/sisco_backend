import { DwhConexionesService } from './../dwh-conexiones/dwh-conexiones.service';
import { queryConciliaOperacionesDWH, ConciliaOperacionesDWHInput, ConciliacionOperacionesDWHQueryResponse } from './../shared/models/query-operaciones-dwh.model';
import { ConciliaExternaDWHEntity } from './entities/concilia-externa-dwh.entity';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConciliaExternaDwhInput } from './dto/concilia-externa-dwh.input';
import { DataSource, Repository } from 'typeorm';
import { VDifCantidadRecepcion, VConciliaExternaDWH } from './concilia-externa-dwh.model';

@Injectable()
export class ConciliaExternaDwhService {
  constructor(
    @InjectRepository(ConciliaExternaDWHEntity) private readonly conciliacionDWHRepository: Repository<ConciliaExternaDWHEntity>,
    @InjectDataSource() private readonly connection: DataSource,
    private _dwhConexionSvc: DwhConexionesService,
  ) {}

  async recepcionesDifCantidad(annio, mes, division, unidad, divisionOD, unidadOD): Promise<VDifCantidadRecepcion[]> {
    try {
      const stringQuery = `SELECT * FROM dbo.vRecepcionesDiferenciaCantidad
            WHERE YEAR(Fecha) = ${annio} AND MONTH(Fecha) = ${mes}
            AND ((IdDivision = CASE ${division} WHEN 0 THEN IdDivision ELSE ${division} END AND IdUnidad = CASE ${unidad} WHEN 0 THEN IdUnidad ELSE ${unidad} END
                AND IdDivisionCtaFin = CASE ${divisionOD} WHEN 0 THEN IdDivisionCtaFin ELSE ${divisionOD} END AND IdCuentaFinanciera = CASE ${unidadOD} WHEN 0 THEN IdCuentaFinanciera ELSE ${unidadOD} END)
            OR (IdDivision = CASE ${divisionOD} WHEN 0 THEN IdDivision ELSE ${divisionOD} END AND IdUnidad = CASE ${unidadOD} WHEN 0 THEN IdUnidad ELSE ${unidadOD} END
                AND IdDivisionCtaFin = CASE ${division} WHEN 0 THEN IdDivisionCtaFin ELSE ${division} END AND IdCuentaFinanciera = CASE ${unidad} WHEN 0 THEN IdCuentaFinanciera ELSE ${unidad} END))`;

      return new Promise<VDifCantidadRecepcion[]>((resolve, reject) => {
        this.connection
          .query(stringQuery)
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err.message || err);
          });
      });
    } catch (err) {
      return Promise.reject(err.message || err);
    }
  }

  // conciliacion con el DWH
  async conciliacionDWH(annio, mes, division, unidad, divisionOD, unidadOD): Promise<VConciliaExternaDWH> {
    try {
      const stringQuery = `select * from vConciliacionDWH
            where Annio = ${annio} and Mes = ${mes}
            AND ((DivisionEmisor = CASE WHEN ${division} = 0 THEN DivisionEmisor ELSE ${division} END AND Emisor = CASE WHEN ${unidad} = 0 THEN Emisor ELSE ${unidad} END
                AND DivisionReceptor = CASE WHEN ${divisionOD} = 0 THEN DivisionReceptor ELSE ${divisionOD} END AND Receptor = CASE WHEN ${unidadOD} = 0 THEN Receptor ELSE ${unidadOD} END)
            OR (DivisionEmisor = CASE WHEN ${divisionOD} = 0 THEN DivisionEmisor ELSE ${divisionOD} END AND Emisor = CASE WHEN ${unidadOD} = 0 THEN Emisor ELSE ${unidadOD} END
                AND DivisionReceptor = CASE WHEN ${division} = 0 THEN DivisionReceptor ELSE ${division} END AND Receptor = CASE WHEN ${unidad} = 0 THEN Receptor ELSE ${unidad} END))`;

      return new Promise<VConciliaExternaDWH>((resolve, reject) => {
        this.connection
          .query(stringQuery)
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err.message || err);
          });
      });
    } catch (err) {
      return Promise.reject(err.message || err);
    }
  }

  async updateConciliaDWH(data: ConciliaExternaDwhInput[]): Promise<number> {
    try {
      return new Promise<number>((resolve, reject) => {
        data.forEach(d => {
          // const recibido: number = d.Recibido ? 1 : 0;
          // const stringQuery = `update dbo.ConciliacionDWH
          //             set Recibido = ${recibido}
          //             where Id = ${d.Id}`;
          this.conciliacionDWHRepository
            .createQueryBuilder()
            .update()
            .set({ Recibido: d.Recibido })
            .where('Id = :id', { id: d.Id })
            .execute()
            .catch(err => {
              reject(err.message || err);
            });
        });

        resolve(data.length);
      });
    } catch (err) {
      return Promise.reject(err.message || err);
    }
  }

  async conciliaExternaDWH(inputValues: ConciliaOperacionesDWHInput): Promise<ConciliacionOperacionesDWHQueryResponse> {
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

      const conexionResp = await this._dwhConexionSvc.DWHConexion(100);
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
