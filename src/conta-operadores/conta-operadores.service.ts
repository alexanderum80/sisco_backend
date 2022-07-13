import { ContaOperadoresQueryResponse } from './conta-operadores.model';
import { ContaOperadoresEntity } from './conta-operadores.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ContaOperadoresService {
    constructor(
        @InjectRepository(ContaOperadoresEntity) private readonly contaOperadoresRepository: Repository<ContaOperadoresEntity>
    ) {}

    async getAllOperadores(): Promise<ContaOperadoresQueryResponse> {
        try {
            return new Promise<ContaOperadoresQueryResponse>(resolve => {
                this.contaOperadoresRepository.find().then(result => {
                    resolve({
                        success: true,
                        data: result
                    });
                }).catch(err => {
                    throw new Error(err);
                });
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }
}
