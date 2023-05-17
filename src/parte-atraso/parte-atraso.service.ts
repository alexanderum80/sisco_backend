import { DataSource } from 'typeorm';
import { UnidadesService } from './../unidades/unidades.service';
import { DwhConexionesService } from './../dwh-conexiones/dwh-conexiones.service';
import { Injectable } from '@nestjs/common';
import { queryParteAtrasos, queryDatosIdGAM } from './parte-atraso.model';
import { join } from 'lodash';
import { DatosIdGamEntity, ParteAtrasoEntity } from './parte-atraso.entity';

@Injectable()
export class ParteAtrasoService {
  constructor(private _dwhConexionesService: DwhConexionesService, private _unidadesService: UnidadesService) {}

  async parteAtrasos(idDivision: number): Promise<ParteAtrasoEntity[]> {
    try {
      // obtener la conexion de los DWH de la Empresa
      const dwhConnectionDistEmpresa = await (await this._dwhConexionesService.conexionRestEmpresa()).initialize();
      const dwhConnectionDWHEmpresa = await (await this._dwhConexionesService.conexionDWHEmpresa()).initialize();

      const parteAtrasos: ParteAtrasoEntity[] = [];

      // obtener la conexion al DWH
      const _conexionDWHQuery = await this._dwhConexionesService.DWHConexion(idDivision);
      if (!_conexionDWHQuery.success) {
        throw new Error('No se pudo obtener la Conexión al DWH de la División. <br ' + _conexionDWHQuery.error);
      }
      if (!_conexionDWHQuery.data) {
        throw new Error('No se ha definido ninguna conexión al DWH de la División.');
      }
      const _conexionDWH = _conexionDWHQuery.data;
      const dwhConnectionRest = await (await this._dwhConexionesService.conexionDWH(_conexionDWH.ConexionRest.toString())).initialize();
      const dwhConnectionDWH = await (await this._dwhConexionesService.conexionDWH(_conexionDWH.ConexionDWH.toString())).initialize();

      // obtener listados de las unidades subordinadas
      const _unidadesQuery = await this._unidadesService.getUnidadesAbiertasByIdDivision(idDivision);
      if (!_unidadesQuery.success) {
        throw new Error(_unidadesQuery.error);
      }
      const _unidades = _unidadesQuery.data;

      const _getParteAtrasosRest = this._getParteAtrasos(dwhConnectionRest, _unidades);
      const _getParteAtrasosDWH = this._getParteAtrasos(dwhConnectionDWH, _unidades);
      const _getParteAtrasosDist = this._getParteAtrasos(dwhConnectionDistEmpresa, _unidades);
      const _getParteAtrasosEmp = this._getParteAtrasos(dwhConnectionDWHEmpresa, _unidades);

      await Promise.all([_getParteAtrasosRest, _getParteAtrasosDWH, _getParteAtrasosDist, _getParteAtrasosEmp]).then(results => {
        for (let i = 0; i < _unidades.length; i++) {
          const unidad = _unidades[i];
          const parteUnidad: ParteAtrasoEntity = {
            IdUnidad: unidad.IdUnidad,
            Unidad: unidad.IdUnidad + '-' + unidad.Nombre,
            IdDivision: unidad.IdDivision,
            Division: unidad.IdDivision + '-' + unidad.Division.Division,
            AtrasoRest: '0',
            AtrasoDWH: '0',
            AtrasoDist: '0',
            AtrasoEmp: '0',
          };

          const atrasoRest = results[0].find((f: any) => f.IdUnidad === unidad.IdUnidad);
          if (atrasoRest) {
            parteUnidad.AtrasoRest = atrasoRest.Atraso;
          }

          const atrasoDWH = results[1].find((f: any) => f.IdUnidad === unidad.IdUnidad);
          if (atrasoDWH) {
            parteUnidad.AtrasoDWH = atrasoDWH.Atraso;
          }

          const atrasoDist = results[2].find((f: any) => f.IdUnidad === unidad.IdUnidad);
          if (atrasoDist) {
            parteUnidad.AtrasoDist = atrasoDist.Atraso;
          }

          const atrasoEmp = results[3].find((f: any) => f.IdUnidad === unidad.IdUnidad);
          if (atrasoEmp) {
            parteUnidad.AtrasoEmp = atrasoEmp.Atraso;
          }

          parteAtrasos.push(parteUnidad);
        }
      });

      return new Promise<ParteAtrasoEntity[]>(resolve => {
        resolve(parteAtrasos);
      });
    } catch (err: any) {
      return Promise.reject(err.message || err);
    }
  }

  private async _getParteAtrasos(dataSource: DataSource, unidades: any): Promise<any> {
    const _query =
      queryParteAtrasos +
      ` HAVING UC.IdUnidad IN (${join(
        unidades.map((u: { IdUnidad: number }) => u.IdUnidad),
        ', ',
      )})`;

    return new Promise<any>((resolve, reject) => {
      dataSource
        .query(_query)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err.message || err);
        });
    });
  }

  // Obtener los IdGAM
  async datosIdGAM(idDivision: number): Promise<DatosIdGamEntity[]> {
    try {
      // obtener listados de las unidades subordinadas
      const _unidadesQuery = await this._unidadesService.getUnidadesAbiertasByIdDivision(idDivision);
      if (!_unidadesQuery.success) {
        throw new Error(_unidadesQuery.error);
      }
      const _unidades = _unidadesQuery.data;

      // obtener la conexion al DWH
      const _conexionDWHQuery = await this._dwhConexionesService.DWHConexion(idDivision);
      if (!_conexionDWHQuery.success) {
        throw new Error('No se pudo obtener la Conexión al DWH de la División. <br ' + _conexionDWHQuery.error);
      }
      if (!_conexionDWHQuery.data) {
        throw new Error('No se ha definido ninguna conexión al DWH de la División.');
      }
      const _conexionDWH = _conexionDWHQuery.data;
      const dwhConnectionRest = await (await this._dwhConexionesService.conexionDWH(_conexionDWH.ConexionRest.toString())).initialize();

      return new Promise<DatosIdGamEntity[]>((resolve, reject) => {
        const _query =
          queryDatosIdGAM.replace('@Annio', new Date().getFullYear().toString()) +
          ` AND IdGerencia IN (${join(
            _unidades.map((u: { IdUnidad: number }) => u.IdUnidad),
            ', ',
          )})`;
        dwhConnectionRest
          .query(_query)
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
