import { InjectRepository } from '@nestjs/typeorm';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { RodasVentas } from './rodas-ventas.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class RodasVentasService {
    constructor(
        @InjectRepository(RodasVentas) private readonly rodasVentasRepository: Repository<RodasVentas>
    ) {}

    async insertRodasVentas(rodasVentas: RodasVentas): Promise<MutationResponse> {
        // try {
            return new Promise<MutationResponse>((resolve) => {
                this.rodasVentasRepository.save(rodasVentas).then(() => {
                    resolve({ success: true });
                }).catch(err => {
                    throw new Error(err.message ? err.message : err);
                });
            });
        // } catch (err) {
        //     return { success: false, error: err.message ? err.message : err };
        // }
    }
    async deleteRodasVentas(idCentro: number, periodo: number): Promise<MutationResponse> {
        // try {
            return new Promise<MutationResponse>((resolve) => {
                this.rodasVentasRepository.delete({ IdCentro: idCentro, Periodo: periodo }).then(() => {
                    resolve({ success: true });
                }).catch(err => {
                    throw new Error(err.message ? err.message : err);
                });
            });
        // } catch (err) {
        //     return { success: false, error: err.message ? err.message : err };
        // }
    }

}
