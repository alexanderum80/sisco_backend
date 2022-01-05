import { Usuarios } from './../usuarios/usuarios.entity';
import { UsuariosService } from './../usuarios/usuarios.service';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { Empleado } from './empleados.entity';
import { EmpleadosQueryResponse, EmpleadoQueryResponse } from './empleados.model';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class EmpleadosService {
    constructor(
        @InjectConnection() private readonly connection: Connection,
        @InjectRepository(Empleado) private readonly empleadoRepository: Repository<Empleado>,
        private _usuariosSvc: UsuariosService
    ) {}

    async getAllEmpleados(user: Usuarios): Promise<EmpleadosQueryResponse> {
        try {
            const { IdDivision, IdTipoUsuario } = user;

            let _condition = { };

            if (!this._usuariosSvc.isSuperAdmin(IdDivision, IdTipoUsuario)) {
                _condition = { IdDivision: IdDivision };
            }

            return new Promise<EmpleadosQueryResponse>(resolve => {
                // this.connection.query(query).then(res => {
                this.empleadoRepository.find({ where: _condition, relations: ['Cargo', 'Division'] }).then(res => {
                    resolve({ success: true, data: res });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async getEmpleadoById(_id): Promise<EmpleadoQueryResponse> {
        try {
            return new Promise<EmpleadoQueryResponse>(resolve => {
                this.empleadoRepository.findOne(_id, { relations: ['Cargo', 'Division']}).then(res => {
                    resolve({ success: true, data: res });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async saveEmpleado(empleadoInfo): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>(resolve => {
                this.empleadoRepository.save(empleadoInfo).then(res => {
                    resolve({ success: true });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async deleteEmpleado(_id): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>(resolve => {
                this.empleadoRepository.delete(_id).then(res => {
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
