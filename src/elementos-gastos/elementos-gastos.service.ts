import { MutationResponse } from './../shared/models/mutation.response.model';
import { ElementoGastoInput } from './elementos-gastos.model';
import { ContaElementosGastosEntity } from './elementos-gastos.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ElementosGastosService {
  constructor(@InjectRepository(ContaElementosGastosEntity) private readonly elementosGastosRepository: Repository<ContaElementosGastosEntity>) {}

  async getAllElementoGastos(): Promise<ContaElementosGastosEntity[]> {
    try {
      return new Promise<ContaElementosGastosEntity[]>((resolve, reject) => {
        this.elementosGastosRepository
          .find({ order: { Egasto: 'ASC' } })
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

  async getElementoGastoById(id: string): Promise<ContaElementosGastosEntity> {
    try {
      return new Promise<ContaElementosGastosEntity>((resolve, reject) => {
        this.elementosGastosRepository
          .findOne({ where: [{ Egasto: id }] })
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

  async saveElementoGasto(elementoGastoInfo: ElementoGastoInput): Promise<MutationResponse> {
    try {
      return new Promise<MutationResponse>(resolve => {
        this.elementosGastosRepository
          .save(elementoGastoInfo)
          .then(() => {
            resolve({ success: true });
          })
          .catch(err => {
            resolve({ success: false, error: err.message ? err.message : err });
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async deleteElementoGasto(id: string): Promise<MutationResponse> {
    try {
      return new Promise<MutationResponse>(resolve => {
        this.elementosGastosRepository
          .delete(id)
          .then(() => {
            resolve({ success: true });
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
