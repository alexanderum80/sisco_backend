import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { MutationResponse } from 'src/shared/models/mutation.response.model';
import { Repository } from 'typeorm';
import { ContaComprobarExpresionesEntity } from './conta-comprobar-expresiones.entity';
import { ContaComprobarExpresionesInput, ContaComprobarExpresionesQueryResponse, ContaComprobarExpresionQueryResponse } from './conta-comprobar-expresiones.model';

@Injectable()
export class ContaComprobarExpresionesService {
    constructor(
        @InjectRepository(ContaComprobarExpresionesEntity) private readonly comprobarExpresionesRepository: Repository<ContaComprobarExpresionesEntity>
    ) {}

    async findAll(): Promise<ContaComprobarExpresionesQueryResponse> {
        try {
            return new Promise<ContaComprobarExpresionesQueryResponse>(resolve => {
                this.comprobarExpresionesRepository.find({ relations: ['Expresion', 'ExpresionC', 'Operador'] }).then(result => {
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

    async findOne(id: number): Promise<ContaComprobarExpresionQueryResponse> {
        try {
            return new Promise<ContaComprobarExpresionQueryResponse>(resolve => {
                this.comprobarExpresionesRepository.findOne(id).then(result => {
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

    async create(comprobarExpresionInput: ContaComprobarExpresionesInput): Promise<MutationResponse> {
        try {
            delete comprobarExpresionInput.Id;

            return new Promise<MutationResponse>(resolve => {
                this.comprobarExpresionesRepository.save(comprobarExpresionInput).then(result => {
                    resolve({ success: true });
                }).catch(err => {
                    throw new Error(err);
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async update(comprobarExpresionInput: ContaComprobarExpresionesInput): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>(resolve => {
                this.comprobarExpresionesRepository.save(comprobarExpresionInput).then(result => {
                    resolve({ success: true });
                }).catch(err => {
                    throw new Error(err);
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async delete(IDs: number[]): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>(resolve => {
                this.comprobarExpresionesRepository.delete(IDs).then(result => {
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
