import { MutationResponse } from './../shared/models/mutation.response.model';
import { ETipoUsuarios } from './../usuarios/usuarios.model';
import { UsuariosEntity } from './../usuarios/usuarios.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContaComprobarExpresionesEntity } from './conta-comprobar-expresiones.entity';
import { ContaComprobarExpresionesInput } from './conta-comprobar-expresiones.model';

@Injectable()
export class ContaComprobarExpresionesService {
  constructor(@InjectRepository(ContaComprobarExpresionesEntity) private readonly comprobarExpresionesRepository: Repository<ContaComprobarExpresionesEntity>) {}

  async findAll(user: UsuariosEntity): Promise<ContaComprobarExpresionesEntity[]> {
    try {
      const { IdDivision } = user;

      const criteria = [{ IdDivision: IdDivision }, { Centralizada: true }];

      return new Promise<ContaComprobarExpresionesEntity[]>((resolve, reject) => {
        this.comprobarExpresionesRepository
          .find({ where: criteria, relations: ['Expresion', 'ExpresionC', 'Operador'] })
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

  async findOne(id: number): Promise<ContaComprobarExpresionesEntity> {
    try {
      return new Promise<ContaComprobarExpresionesEntity>((resolve, reject) => {
        this.comprobarExpresionesRepository
          .findOne({ where: [{ Id: id }] })
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

  async create(user: UsuariosEntity, comprobarExpresionInput: ContaComprobarExpresionesInput): Promise<MutationResponse> {
    try {
      const { IdDivision, IdTipoUsuario } = user;

      delete comprobarExpresionInput.Id;

      comprobarExpresionInput.Centralizada = IdDivision === 100 && IdTipoUsuario === ETipoUsuarios['Usuario Avanzado'];

      return new Promise<MutationResponse>(resolve => {
        this.comprobarExpresionesRepository
          .save(comprobarExpresionInput)
          .then(() => {
            resolve({ success: true });
          })
          .catch(err => {
            throw new Error(err);
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async update(comprobarExpresionInput: ContaComprobarExpresionesInput): Promise<MutationResponse> {
    try {
      return new Promise<MutationResponse>(resolve => {
        this.comprobarExpresionesRepository
          .save(comprobarExpresionInput)
          .then(() => {
            resolve({ success: true });
          })
          .catch(err => {
            throw new Error(err);
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async delete(IDs: number[]): Promise<MutationResponse> {
    try {
      return new Promise<MutationResponse>(resolve => {
        this.comprobarExpresionesRepository
          .delete(IDs)
          .then(() => {
            resolve({ success: true });
          })
          .catch(err => {
            throw new Error(err);
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }
}
