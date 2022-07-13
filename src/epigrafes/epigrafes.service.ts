import { MutationResponse } from './../shared/models/mutation.response.model';
import { EpigrafesQueryResponse, EpigrafeQueryResponse, EpigrafeInput } from './epigrafes.model';
import { ContaEpigrafes } from './epigrafes.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EpigrafesService {
    constructor(
        @InjectRepository(ContaEpigrafes) private readonly epigrafeRepository: Repository<ContaEpigrafes>
    ) { }

    async getAllEpigrafes(): Promise<EpigrafesQueryResponse> {
        try {
            return new Promise<EpigrafesQueryResponse>(resolve => {
                this.epigrafeRepository.find().then(result => {
                    resolve({
                        success: true,
                        data: result
                    });
                })
                .catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async getEpigrafeById(id: number): Promise<EpigrafeQueryResponse> {
        try {
            return new Promise<EpigrafeQueryResponse>(resolve => {
                this.epigrafeRepository.findOne({ IdEpigafre: id }).then(result => {
                    resolve({
                        success: true,
                        data: result
                    });
                })
                .catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async createEpigrafe(epigrafeInfo: EpigrafeInput): Promise<MutationResponse> {
        try {
            delete epigrafeInfo.IdEpigafre;

            return new Promise<MutationResponse>(resolve => {
                this.epigrafeRepository.save(epigrafeInfo).then(() => {
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
                this.epigrafeRepository.save(epigrafeInfo).then(() => {
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
                this.epigrafeRepository.delete(IDs).then(() => {
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
