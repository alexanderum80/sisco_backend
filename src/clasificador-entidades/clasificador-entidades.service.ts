import { MutationResponse } from '../shared/models/mutation.response.model';
import { ContaClasificarunidades } from './clasificador-entidades.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectConnection } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { ClasificadorEntidadQueryResponse as ClasificadorEntidadQueryResponse, ClasificadorEntidadInput, VClasificadorEntidadesQueryResponse } from './clasificador-entidades.model';

@Injectable()
export class ClasificadorEntidadesService {
    constructor(
        @InjectConnection() private readonly connection: Connection,
        @InjectRepository(ContaClasificarunidades) private readonly clasificarEntidadesRepository: Repository<ContaClasificarunidades>
    ) {}

    async getAllClasificadorEntidades(): Promise<VClasificadorEntidadesQueryResponse> {
        try {
            return new Promise<VClasificadorEntidadesQueryResponse>(resolve => {
                this.connection.query('Select * from vConta_ClasificarUnidades').then(result => {
                    resolve({
                        success: true,
                        data: result
                    });
                }).catch(err => {
                    return { success: false, error: err.message ? err.message : err };
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async getClasificadorEntidad(idUnidad: number): Promise<ClasificadorEntidadQueryResponse> {
        try {
            return new Promise<ClasificadorEntidadQueryResponse>(resolve => {
                this.clasificarEntidadesRepository.findOne({ IdUnidad: idUnidad }).then(result => {
                    resolve({
                        success: true,
                        data: result
                    });
                }).catch(err => {
                    return { success: false, error: err.message ? err.message : err };
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async saveClasificadorEntidad(clasificadorEntidadInfo: ClasificadorEntidadInput): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>(resolve => {
                this.clasificarEntidadesRepository.save(clasificadorEntidadInfo).then(() => {
                    resolve({ success: true });
                }).catch(err => {
                    return { success: false, error: err.message ? err.message : err };
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async deleteClasificadorEntidad(idUnidad: number): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>(resolve => {
                this.clasificarEntidadesRepository.delete({ IdUnidad: idUnidad }).then(result => {
                    resolve({ success: true });
                }).catch(err => {
                    return { success: false, error: err.message ? err.message : err };
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }
}
