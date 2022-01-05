import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { MutationResponse } from 'src/shared/models/mutation.response.model';
import { Connection, Repository } from 'typeorm';
import { ContaComprobarExpresionesEntity } from './conta-comprobar-expresiones.entity';
import { ContaComprobarExpresionesInput, ContaComprobarExpresionesQueryResponse, ContaComprobarExpresionQueryResponse } from './conta-comprobar-expresiones.model';

@Injectable()
export class ContaComprobarExpresionesService {
    constructor(
        @InjectConnection() private readonly connection: Connection,
        @InjectRepository(ContaComprobarExpresionesEntity) private readonly comprobarExpresionesEntity: Repository<ContaComprobarExpresionesEntity>
    ) {}

    async getAllComprobarExpresiones(): Promise<ContaComprobarExpresionesQueryResponse> {
        try {
            return new Promise<ContaComprobarExpresionesQueryResponse>(resolve => {
                this.connection.query('select * from vConta_ComprobarExpresiones').then(result => {
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

    async getComprobarExpresionById(id: number): Promise<ContaComprobarExpresionQueryResponse> {
        try {
            return new Promise<ContaComprobarExpresionQueryResponse>(resolve => {
                this.comprobarExpresionesEntity.findOne(id).then(result => {
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

    async saveComprobarExpresion(comprobarExpresionInput: ContaComprobarExpresionesInput): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>(resolve => {
                this.comprobarExpresionesEntity.save(comprobarExpresionInput).then(result => {
                    resolve({ success: true });
                }).catch(err => {
                    throw new Error(err);
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async deleteComprobarExpresion(id: number): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>(resolve => {
                this.comprobarExpresionesEntity.delete(id).then(result => {
                    resolve({ success: true });
                }).catch(err => {
                    throw new Error(err);
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }
}
