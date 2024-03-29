import { MutationResponse } from './../shared/models/mutation.response.model';
import { ContaTipoentidadesQueryResponse, ContaTipoentidadQueryResponse, TipoEntidadInput } from './tipo-entidades.model';
import { TipoEntidades } from './tipo-entidades.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TipoEntidadesService {
  constructor(@InjectRepository(TipoEntidades) private readonly tipoEntidadesRepository: Repository<TipoEntidades>) {}

  async getAllTipoEntidades(): Promise<ContaTipoentidadesQueryResponse> {
    try {
      return new Promise<ContaTipoentidadesQueryResponse>(resolve => {
        this.tipoEntidadesRepository
          .find()
          .then(result => {
            resolve({
              success: true,
              data: result,
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

  async getTipoEntidadById(id: number): Promise<ContaTipoentidadQueryResponse> {
    try {
      return new Promise<ContaTipoentidadQueryResponse>(resolve => {
        this.tipoEntidadesRepository
          .findOne({ where: [{ Id: id }] })
          .then(result => {
            resolve({
              success: true,
              data: result,
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

  async createTipoEntidad(tipoEntidadInfo: TipoEntidadInput): Promise<MutationResponse> {
    try {
      delete tipoEntidadInfo.Id;

      return new Promise<MutationResponse>(resolve => {
        this.tipoEntidadesRepository
          .save(tipoEntidadInfo)
          .then(() => {
            resolve({ success: true });
          })
          .catch(err => {
            return { success: false, error: err.message ? err.message : err };
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async updateTipoEntidad(tipoEntidadInfo: TipoEntidadInput): Promise<MutationResponse> {
    try {
      return new Promise<MutationResponse>(resolve => {
        this.tipoEntidadesRepository
          .save(tipoEntidadInfo)
          .then(() => {
            resolve({ success: true });
          })
          .catch(err => {
            return { success: false, error: err.message ? err.message : err };
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async deleteTipoEntidad(IDs: number[]): Promise<MutationResponse> {
    try {
      return new Promise<MutationResponse>(resolve => {
        this.tipoEntidadesRepository
          .delete(IDs)
          .then(() => {
            resolve({ success: true });
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
