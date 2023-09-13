import { TipoUsuariosQueryResponse, TipoUsuarioQueryResponse } from './tipo-usuarios.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoUsuarios } from './tipo-usuarios.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TipoUsuariosService {
  constructor(@InjectRepository(TipoUsuarios) private readonly tipoUsuariosRepository: Repository<TipoUsuarios>) {}

  async findAll(): Promise<TipoUsuariosQueryResponse> {
    try {
      return new Promise<TipoUsuariosQueryResponse>(resolve => {
        this.tipoUsuariosRepository
          .find()
          .then(result => {
            resolve({
              success: true,
              data: result,
            });
          })
          .catch(err => {
            throw new Error(err);
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async findOne(id: number): Promise<TipoUsuarioQueryResponse> {
    try {
      return new Promise<TipoUsuarioQueryResponse>(resolve => {
        this.tipoUsuariosRepository
          .findOne({ where: [{ IdTipo: id }] })
          .then(result => {
            resolve({
              success: true,
              data: result,
            });
          })
          .catch(err => {
            throw new Error(err);
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }
}
