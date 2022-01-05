import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContaTipoValorExpresionesEntity } from './conta-tipovalor-expresiones.entity';
import { ContaTipoValorExpresionesQueryResponse } from './conta-tipovalor-expresiones.model';

@Injectable()
export class ContaTipovalorExpresionesService {
    constructor(
        @InjectRepository(ContaTipoValorExpresionesEntity) private readonly tipoValorExpresionesRepos: Repository<ContaTipoValorExpresionesEntity>,
    ) {}

    async getAllContaTipoValorExpresiones(): Promise<ContaTipoValorExpresionesQueryResponse> {
        try {
            return new Promise<ContaTipoValorExpresionesQueryResponse>(resolve => {
                this.tipoValorExpresionesRepos.find().then(result => {
                    resolve({
                        success: true,
                        data: result
                    });
                }).catch(err => {
                    throw new Error(err);
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }
}
