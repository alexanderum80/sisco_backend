import { MutationResponse } from './../shared/models/mutation.response.model';
import { EpigrafeInput } from './epigrafes.model';
import { ContaEpigrafesEntity } from './epigrafes.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EpigrafesService {
  constructor(@InjectRepository(ContaEpigrafesEntity) private readonly epigrafeRepository: Repository<ContaEpigrafesEntity>) {}

  async getAllEpigrafes(): Promise<ContaEpigrafesEntity[]> {
    try {
      return new Promise<ContaEpigrafesEntity[]>((resolve, reject) => {
        this.epigrafeRepository
          .find()
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

  async getEpigrafeById(id: number): Promise<ContaEpigrafesEntity> {
    try {
      return new Promise<ContaEpigrafesEntity>((resolve, reject) => {
        this.epigrafeRepository
          .findOne({ where: [{ IdEpigrafe: id }] })
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

  async createEpigrafe(epigrafeInfo: EpigrafeInput): Promise<MutationResponse> {
    try {
      delete epigrafeInfo.IdEpigrafe;

      return new Promise<MutationResponse>(resolve => {
        this.epigrafeRepository
          .save(epigrafeInfo)
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

  async updateEpigrafe(epigrafeInfo: EpigrafeInput): Promise<MutationResponse> {
    try {
      return new Promise<MutationResponse>(resolve => {
        this.epigrafeRepository
          .save(epigrafeInfo)
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

  async deleteEpigrafe(IDs: number[]): Promise<MutationResponse> {
    try {
      return new Promise<MutationResponse>(resolve => {
        this.epigrafeRepository
          .delete(IDs)
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
