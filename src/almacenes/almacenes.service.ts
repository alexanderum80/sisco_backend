import { MutationResponse } from './../shared/models/mutation.response.model';
import { Almacenes } from './almacenes.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AlmacenesService {
    constructor(@InjectRepository(Almacenes) private readonly almacenesRepository: Repository<Almacenes>) {}

    async insertAlmacenes(almacen: Almacenes): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>(resolve => {
                this.almacenesRepository
                    .save(almacen)
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

    async deleteAlmacenesByIdUnidad(idUnidad: number): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>(resolve => {
                this.almacenesRepository
                    .delete({ IdUnidad: idUnidad })
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
