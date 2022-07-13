import { MutationResponse } from './../shared/models/mutation.response.model';
import { InjectRepository } from '@nestjs/typeorm';
import { RodasInventario } from './rodas-inventario.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class RodasInventarioService {
    constructor(
        @InjectRepository(RodasInventario) private readonly rodasInventarioRepository: Repository<RodasInventario>
    ) {}

    async insertRodasInventario(rodasInventario: RodasInventario): Promise<MutationResponse> {
        // try {
            return new Promise<MutationResponse>((resolve) => {
                this.rodasInventarioRepository.save(rodasInventario).then(() => {
                    resolve({ success: true });
                }).catch(err => {
                    throw new Error(err.message ? err.message : err);
                });
            });
        // } catch (err: any) {
        //     return { success: false, error: err.message ? err.message : err };
        // }
    }

    async deleteRodasInventario(idCentro: number, periodo: number): Promise<MutationResponse> {
        // try {
            return new Promise<MutationResponse>((resolve) => {
                this.rodasInventarioRepository.delete({ IdCentro: idCentro, Periodo: periodo }).then(() => {
                    resolve({ success: true });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        // } catch (err: any) {
        //     return { success: false, error: err.message ? err.message : err };
        // }
    }
}
