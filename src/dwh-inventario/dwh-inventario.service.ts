import { MutationResponse } from './../shared/models/mutation.response.model';
import { DWHInventario } from './dwh-inventario.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DwhInventarioService {
    constructor(@InjectRepository(DWHInventario) private readonly dwhInventarioRepository: Repository<DWHInventario>) {}

    async insertDWHInventario(dwhInventario: DWHInventario): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>(resolve => {
                this.dwhInventarioRepository
                    .save(dwhInventario)
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

    async deleteDWHInventario(idCentro: number, periodo: number): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>(resolve => {
                this.dwhInventarioRepository
                    .delete({ IdCentro: idCentro, Periodo: periodo })
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
