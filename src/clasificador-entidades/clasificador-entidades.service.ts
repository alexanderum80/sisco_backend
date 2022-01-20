import { TipoEntidades } from './../tipo-entidades/tipo-entidades.entity';
import { CentrosView } from './../unidades/unidades.entity';
import { MutationResponse } from '../shared/models/mutation.response.model';
import { ClasificarEntidades } from './clasificador-entidades.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClasificadorEntidadQueryResponse, ClasificadorEntidadInput, ClasificadorEntidadesQueryResponse } from './clasificador-entidades.model';

@Injectable()
export class ClasificadorEntidadesService {
    constructor(
        @InjectRepository(ClasificarEntidades) private readonly clasificarEntidadesRepository: Repository<ClasificarEntidades>
    ) {}

    async findAll(): Promise<ClasificadorEntidadesQueryResponse> {
        try {
            return new Promise<ClasificadorEntidadesQueryResponse>(resolve => {
                this.clasificarEntidadesRepository.createQueryBuilder('clas')
                    .select('clas.IdUnidad', 'IdUnidad')
                    .addSelect('clas.IdTipoEntidad', 'IdTipoEntidad')
                    .addSelect('Concat(centros.IdUnidad, \'-\', centros.Nombre)', 'Unidad')
                    .addSelect('tipo.Entidades', 'TipoEntidad')
                    .innerJoin(CentrosView, 'centros', 'centros.IdUnidad = clas.IdUnidad')
                    .innerJoin(TipoEntidades, 'tipo', 'tipo.Id = clas.IdTipoEntidad')
                .execute().then(result => {
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

    async findOne(idUnidad: number): Promise<ClasificadorEntidadQueryResponse> {
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

    async create(clasificadorEntidadInfo: ClasificadorEntidadInput): Promise<MutationResponse> {
        try {
            const clasif = await this.clasificarEntidadesRepository.findOne(clasificadorEntidadInfo.IdUnidad);

            if (clasif) {
                return { success: false, error: `La Entidad ${ clasificadorEntidadInfo.IdUnidad } ya está clasificada. Si lo desea, modifíquela.` };
            }

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

    async update(clasificadorEntidadInfo: ClasificadorEntidadInput): Promise<MutationResponse> {
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

    async delete(IDs: number[]): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>(resolve => {
                this.clasificarEntidadesRepository.delete(IDs).then(result => {
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
