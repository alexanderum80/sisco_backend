import { UsuariosEntity } from './../usuarios/usuarios.entity';
import { UsuariosService } from './../usuarios/usuarios.service';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CentrosView, UnidadesEntity } from './unidades.entity';

@Injectable()
export class UnidadesService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(UnidadesEntity) private readonly unidadesRepository: Repository<UnidadesEntity>,
    private _usuariosSvc: UsuariosService,
  ) {}

  async getAllUnidades(user?: UsuariosEntity): Promise<CentrosView[]> {
    try {
      let _condition = {};

      if (user) {
        const { IdDivision, IdTipoUsuario } = user;

        if (!this._usuariosSvc.isSuperAdmin(IdDivision, IdTipoUsuario) && !this._usuariosSvc.isAdvancedUser(IdDivision, IdTipoUsuario)) {
          _condition = [{ IdDivision: IdDivision }, { IdDivision: 101 }];
        }
      }

      return new Promise<CentrosView[]>((resolve, reject) => {
        this.dataSource.manager
          .find(CentrosView, { where: _condition, order: { IdUnidad: 'ASC' } })
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

  async getUnidadById(IdUnidad: number): Promise<CentrosView> {
    try {
      return new Promise<CentrosView>((resolve, reject) => {
        this.dataSource.manager
          .findOne(CentrosView, { where: { IdUnidad }, order: { IdUnidad: 'ASC' } })
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

  async getUnidadesByIdSubdivision(IdSubdivision: number): Promise<CentrosView[]> {
    try {
      return new Promise<CentrosView[]>((resolve, reject) => {
        this.dataSource.manager
          .find(CentrosView, { where: { IdSubdivision }, order: { IdUnidad: 'ASC' } })
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

  async getUnidadesByIdDivision(IdDivision: number): Promise<CentrosView[]> {
    try {
      return new Promise<CentrosView[]>((resolve, reject) => {
        this.dataSource.manager
          .find(CentrosView, { where: { IdDivision }, order: { IdUnidad: 'ASC' } })
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

  async getUnidadesAbiertasByIdSubdivision(idSubdivision: number): Promise<any> {
    try {
      return new Promise<any>(resolve => {
        this.unidadesRepository
          .find({
            where: [
              { IdComplejo: idSubdivision, Abierta: true },
              { IdUnidad: idSubdivision, Abierta: true },
            ],
            relations: { Division: true },
            order: { IdUnidad: 'ASC' },
          })
          // this.dataSource
          //   .query(
          //     `Select U.*, D.Division from Unidades AS U INNER JOIN Divisiones AS D ON D.Id_Division = U.Id_Division
          //       WHERE (case COALESCE(Id_Complejo, 0) when 0 THEN Id_Unidad else Id_Complejo end) = ${idSubdivision}
          //       AND Abierta = true
          //       order by Id_unidad`,
          //   )
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
      return {
        success: false,
        error: err,
      };
    }
  }

  async getUnidadesAbiertasByIdDivision(idDivision: number): Promise<any> {
    try {
      return new Promise<any>(resolve => {
        this.unidadesRepository
          .find({ where: { IdDivision: idDivision, Abierta: true }, relations: { Division: true }, order: { IdUnidad: 'ASC' } })
          // this.dataSource
          //   .query(
          //     `Select U.*, D.Division from Unidades AS U INNER JOIN Divisiones AS D ON D.Id_Division = U.Id_Division
          //       WHERE U.Id_Division = ${idDivision}
          //       AND Abierta = true
          //       order by Id_unidad`,
          //   )
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
      return {
        success: false,
        error: err,
      };
    }
  }
}
