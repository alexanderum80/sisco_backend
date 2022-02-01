import { ETipoUsuarios } from './../usuarios/usuarios.model';
import { Usuarios } from './../usuarios/usuarios.entity';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { ContaNoUsarEnCuentasQueryResponse, ContaNoUsarEnCuentaQueryResponse, ContaNoUsarEnCuentaInput } from './conta-no-usar-en-cuenta.model';
import { ContaNoUsarEnCuentaEntity } from './conta-no-usar-en-cuenta.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ContaNoUsarEnCuentasService {
    constructor(
        @InjectRepository(ContaNoUsarEnCuentaEntity) private readonly noUsarEnCuentaEntity: Repository<ContaNoUsarEnCuentaEntity>
    ) {}

    async findAll(user: Usuarios): Promise<ContaNoUsarEnCuentasQueryResponse> {
        try {
            const { IdDivision } = user;

            const criteria = [{ IdDivision: IdDivision }, { Centralizada: true }];

            return new Promise<ContaNoUsarEnCuentasQueryResponse>(resolve => {
                this.noUsarEnCuentaEntity.find({ where: criteria }).then(result => {
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

    async findOne(id: number): Promise<ContaNoUsarEnCuentaQueryResponse> {
        try {
            return new Promise<ContaNoUsarEnCuentaQueryResponse>(resolve => {
                this.noUsarEnCuentaEntity.findOne(id).then(result => {
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

    async create(user: Usuarios, noUsarEnCuentaInput: ContaNoUsarEnCuentaInput): Promise<MutationResponse> {
        try {
            delete noUsarEnCuentaInput.Id;

            const { IdDivision, IdTipoUsuario } = user;
            noUsarEnCuentaInput.Centralizada = IdDivision === 100 && IdTipoUsuario === ETipoUsuarios['Usuario Avanzado'];

            return new Promise<MutationResponse>(resolve => {
                this.noUsarEnCuentaEntity.save(noUsarEnCuentaInput).then(result => {
                    resolve({ success: true });
                }).catch(err => {
                    throw new Error(err);
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async update(noUsarEnCuentaInput: ContaNoUsarEnCuentaInput): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>(resolve => {
                this.noUsarEnCuentaEntity.save(noUsarEnCuentaInput).then(result => {
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
                this.noUsarEnCuentaEntity.delete(IDs).then(result => {
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
