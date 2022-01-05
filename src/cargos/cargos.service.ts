import { CargosQueryResponse } from './cargos.model';
import { Cargos } from './cargos.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CargosService {
    constructor(
        @InjectRepository(Cargos) private readonly cargosRepository: Repository<Cargos>
    ) {}

    async getAllCargos(): Promise<CargosQueryResponse> {
        try {
            return new Promise<CargosQueryResponse>((resolve, reject) => {
                this.cargosRepository.find().then(result => {
                    resolve({ success: true, data: result });
                }).catch(err => {
                    reject({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }
}
