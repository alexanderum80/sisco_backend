import { MutationResponse } from './../shared/models/mutation.response.model';
import { DWHVentas } from './dwh-ventas.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class DwhVentasService {
    constructor(
        @InjectRepository(DWHVentas) private readonly dwhVentasRepository: Repository<DWHVentas>
    ) {}

    async insertDWHVentas(dwhVentas: DWHVentas): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>((resolve) => {
                this.dwhVentasRepository.save(dwhVentas).then(() => {
                    resolve({ success: true });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async deleteDWHVentas(idCentro: number, periodo: number): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>((resolve) => {
                this.dwhVentasRepository.delete({ IdCentro: idCentro, Periodo: periodo }).then(() => {
                    resolve({ success: true });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

}
