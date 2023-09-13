import { UsuariosEntity } from './../usuarios/usuarios.entity';
import { UsuariosService } from './../usuarios/usuarios.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DivisionesEntity } from './divisiones.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DivisionesService {
  constructor(@InjectRepository(DivisionesEntity) private readonly divisionesRepository: Repository<DivisionesEntity>, private _usuariosSvc: UsuariosService) {}

  async getAllDivisiones(user?: UsuariosEntity): Promise<DivisionesEntity[]> {
    try {
      let criteria = {};

      if (user) {
        const { IdDivision, IdTipoUsuario } = user;

        if (!this._usuariosSvc.isSuperAdmin(IdDivision, IdTipoUsuario) && !this._usuariosSvc.isAdvancedUser(IdDivision, IdTipoUsuario)) {
          criteria = [{ IdDivision: IdDivision }, { IdDivision: '101' }];
        }
      }

      return new Promise<DivisionesEntity[]>((resolve, reject) => {
        this.divisionesRepository
          .find({ where: criteria, order: { IdDivision: 'ASC' } })
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

  async getDivisionesActivas(): Promise<DivisionesEntity[]> {
    try {
      return new Promise<DivisionesEntity[]>((resolve, reject) => {
        this.divisionesRepository
          .createQueryBuilder()
          .where('IdDivision NOT IN (100, 120, 124)')
          .orderBy('IdDivision')
          .getMany()
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

  async getDivisionById(_id: number): Promise<DivisionesEntity[]> {
    try {
      return new Promise<DivisionesEntity[]>((resolve, reject) => {
        this.divisionesRepository
          .find({ where: [{ IdDivision: _id }], order: { IdDivision: 'ASC' } })
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
