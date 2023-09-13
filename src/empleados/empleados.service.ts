import { UsuariosEntity } from './../usuarios/usuarios.entity';
import { UsuariosService } from './../usuarios/usuarios.service';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { Empleado } from './empleados.entity';
import { EmpleadosQueryResponse, EmpleadoQueryResponse, EmpleadoInput } from './empleados.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EmpleadosService {
  constructor(@InjectRepository(Empleado) private readonly empleadoRepository: Repository<Empleado>, private _usuariosSvc: UsuariosService) {}

  async findAll(user: UsuariosEntity): Promise<EmpleadosQueryResponse> {
    try {
      const { IdDivision, IdTipoUsuario } = user;

      let _condition = {};

      if (!this._usuariosSvc.isSuperAdmin(IdDivision, IdTipoUsuario)) {
        _condition = { IdDivision: IdDivision };
      }

      return new Promise<EmpleadosQueryResponse>(resolve => {
        this.empleadoRepository
          .find({ where: _condition, relations: ['Cargo', 'Division'] })
          .then(res => {
            resolve({ success: true, data: res });
          })
          .catch(err => {
            resolve({ success: false, error: err.message ? err.message : err });
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async findAllByIdDivision(idDivision: number): Promise<EmpleadosQueryResponse> {
    try {
      return new Promise<EmpleadosQueryResponse>(resolve => {
        this.empleadoRepository
          .find({ where: { IdDivision: idDivision }, relations: ['Cargo', 'Division'] })
          .then(res => {
            resolve({ success: true, data: res });
          })
          .catch(err => {
            resolve({ success: false, error: err.message ? err.message : err });
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async findOne(_id: number): Promise<EmpleadoQueryResponse> {
    try {
      return new Promise<EmpleadoQueryResponse>(resolve => {
        this.empleadoRepository
          .findOne({ where: [{ IdEmpleado: _id }], relations: ['Cargo', 'Division'] })
          .then(res => {
            resolve({ success: true, data: res });
          })
          .catch(err => {
            resolve({ success: false, error: err.message ? err.message : err });
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async create(empleadoInfo: EmpleadoInput): Promise<MutationResponse> {
    try {
      delete empleadoInfo.IdEmpleado;

      return new Promise<MutationResponse>(resolve => {
        this.empleadoRepository
          .save(empleadoInfo)
          .then(() => {
            resolve({ success: true });
          })
          .catch(err => {
            resolve({ success: false, error: err.message ? err.message : err });
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async update(empleadoInfo: EmpleadoInput): Promise<MutationResponse> {
    try {
      return new Promise<MutationResponse>(resolve => {
        this.empleadoRepository
          .save(empleadoInfo)
          .then(() => {
            resolve({ success: true });
          })
          .catch(err => {
            resolve({ success: false, error: err.message ? err.message : err });
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async delete(IDs: number[]): Promise<MutationResponse> {
    try {
      return new Promise<MutationResponse>(resolve => {
        this.empleadoRepository
          .delete(IDs)
          .then(() => {
            resolve({ success: true });
          })
          .catch(err => {
            resolve({ success: false, error: err.message ? err.message : err });
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }
}
