import { Usuarios } from './../usuarios/usuarios.entity';
import { UsuariosService } from './../usuarios/usuarios.service';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { SupervisoresQueryResponse, SupervisorQueryResponse, SupervisorDTO } from './supervisores.model';
import { Repository, Connection } from 'typeorm';
import { Supervisor } from './supervisores.entity';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SupervisoresService {
    constructor(
        @InjectRepository(Supervisor) private readonly supervisorRepository: Repository<Supervisor>,
        private _usuariosSvc: UsuariosService
    ) {}

    async findAll(user: Usuarios): Promise<SupervisoresQueryResponse> {
        try {
            const { IdDivision, IdTipoUsuario } = user;

            let _condition = { };

            if (!this._usuariosSvc.isSuperAdmin(IdDivision, IdTipoUsuario)) {
                _condition = { IdDivision: IdDivision };
            }

            return new Promise<SupervisoresQueryResponse>(resolve => {
                this.supervisorRepository.find({ where: _condition, relations: ['Cargo', 'Division'] }).then(res => {
                    resolve({ success: true, data: res });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async findOne(_id): Promise<SupervisorQueryResponse> {
        try {
            return new Promise<SupervisorQueryResponse>(resolve => {
                this.supervisorRepository.findOne(_id, { relations: ['Cargo', 'Division'] }).then(res => {
                    resolve({ success: true, data: res });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async create(SupervisorInfo: SupervisorDTO): Promise<MutationResponse> {
        try {
            delete SupervisorInfo.IdSupervisor;

            return new Promise<MutationResponse>(resolve => {
                this.supervisorRepository.save(SupervisorInfo).then(res => {
                    resolve({ success: true });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async update(SupervisorInfo: SupervisorDTO): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>(resolve => {
                this.supervisorRepository.save(SupervisorInfo).then(res => {
                    resolve({ success: true });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async delete(IDs: number[]): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>(resolve => {
                this.supervisorRepository.delete(IDs).then(res => {
                    resolve({ success: true });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }
}
