import { MutationResponse } from './../shared/models/mutation.response.model';
import { ETipoUsuarios } from './../usuarios/usuarios.model';
import { Usuarios } from './../usuarios/usuarios.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContaComprobarExpresionesEntity } from './conta-comprobar-expresiones.entity';
import { ContaComprobarExpresionesInput, ContaComprobarExpresionesQueryResponse, ContaComprobarExpresionQueryResponse } from './conta-comprobar-expresiones.model';

@Injectable()
export class ContaComprobarExpresionesService {
    constructor(
        @InjectRepository(ContaComprobarExpresionesEntity) private readonly comprobarExpresionesRepository: Repository<ContaComprobarExpresionesEntity>
    ) {}

    async findAll(user: Usuarios): Promise<ContaComprobarExpresionesQueryResponse> {
        try {
            const { IdDivision } = user;

            const criteria = [{ IdDivision: IdDivision }, { Centralizada: true }];

            return new Promise<ContaComprobarExpresionesQueryResponse>(resolve => {
                this.comprobarExpresionesRepository.find({ where: criteria, relations: ['Expresion', 'ExpresionC', 'Operador'] }).then(result => {
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
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async create(user: Usuarios, comprobarExpresionInput: ContaComprobarExpresionesInput): Promise<MutationResponse> {
        try {
            const { IdDivision, IdTipoUsuario } = user;

            delete comprobarExpresionInput.Id;

            comprobarExpresionInput.Centralizada = IdDivision === 100 && IdTipoUsuario === ETipoUsuarios['Usuario Avanzado'];

            return new Promise<MutationResponse>(resolve => {
                this.comprobarExpresionesRepository.save(comprobarExpresionInput).then(() => {
                    resolve({ success: true });
                }).catch(err => {
                    throw new Error(err);
                });
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async update(comprobarExpresionInput: ContaComprobarExpresionesInput): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>(resolve => {
                this.comprobarExpresionesRepository.save(comprobarExpresionInput).then(() => {
                    resolve({ success: true });
                }).catch(err => {
                    throw new Error(err);
                });
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async delete(IDs: number[]): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>(resolve => {
                this.comprobarExpresionesRepository.delete(IDs).then(() => {
                    resolve({ success: true });
                }).catch(err => {
                    throw new Error(err);
                });
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }
}
