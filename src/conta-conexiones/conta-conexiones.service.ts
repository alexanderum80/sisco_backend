import { DEFAULT_POSTGRES_CONNECTION_STRING } from './../conexiones/conexiones.model';
import { UsuariosEntity } from './../usuarios/usuarios.entity';
import { UsuariosService } from './../usuarios/usuarios.service';
import { cloneDeep } from 'lodash';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { ContaConexionInput, EntidadesRodas } from './conta-conexiones.model';
import { ContaConexionesEntity } from './conta-conexiones.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ContaConexionesService {
  constructor(@InjectRepository(ContaConexionesEntity) private readonly conexionesRespository: Repository<ContaConexionesEntity>, private _usuariosSvc: UsuariosService) {}

  async findAll(user: UsuariosEntity): Promise<ContaConexionesEntity[]> {
    try {
      const { IdDivision, IdTipoUsuario } = user;

      let _condition = {};

      if (!this._usuariosSvc.isSuperAdmin(IdDivision, IdTipoUsuario)) {
        _condition = [{ IdDivision: IdDivision }, { IdDivision: '101' }];
      }

      return new Promise<ContaConexionesEntity[]>((resolve, reject) => {
        this.conexionesRespository
          .find({
            where: _condition,
            relations: {
              Division: true,
              Unidad: true,
            },
          })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err.message || err);
          });
      });
    } catch (err: any) {
      return Promise.reject(err.message || err);
    }
  }

  async findOne(id: number): Promise<ContaConexionesEntity> {
    try {
      return new Promise<ContaConexionesEntity>((resolve, reject) => {
        this.conexionesRespository
          .findOne({ where: [{ Id: id }] })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err.message || err);
          });
      });
    } catch (err: any) {
      return Promise.reject(err.message || err);
    }
  }

  async findByIdUnidad(idUnidad: number, consolidado: boolean): Promise<ContaConexionesEntity> {
    return new Promise<ContaConexionesEntity>((resolve, reject) => {
      this.conexionesRespository
        .findOne({ where: [{ IdUnidad: idUnidad, Consolidado: consolidado }] })
        .then(result => {
          if (result) {
            resolve(result);
          } else {
            reject(`No se ha definido la conexión al Rodas del Centro: ${idUnidad}`);
          }
        })
        .catch(err => {
          reject(err.message ? err.message : err);
        });
    });
  }

  async findByIdDivision(idDivision: number): Promise<ContaConexionesEntity[]> {
    return new Promise<ContaConexionesEntity[]>((resolve, reject) => {
      this.conexionesRespository
        .find({ where: { IdDivision: idDivision }, relations: ['Division', 'Unidad'] })
        .then(result => {
          if (result) {
            resolve(result);
          } else {
            reject(`No se han definido las conexiones a los Rodas de la División: ${idDivision}`);
          }
        })
        .catch(err => {
          reject(err.message ? err.message : err);
        });
    });
  }

  async create(conexion: ContaConexionInput): Promise<MutationResponse> {
    try {
      delete conexion.Id;

      // const encryptedPassword = await this._cryptoService.encrypt(conexion.Contrasena);
      // conexion.Contrasena = encryptedPassword;

      return new Promise<MutationResponse>(resolve => {
        this.conexionesRespository
          .save(conexion)
          .then(() => {
            resolve({
              success: true,
            });
          })
          .catch(err => {
            resolve(err.message ? err.message : err);
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async update(conexion: ContaConexionInput): Promise<MutationResponse> {
    try {
      // const encryptedPassword = await this._cryptoService.encrypt(conexion.Contrasena);
      // conexion.Contrasena = encryptedPassword;

      return new Promise<MutationResponse>(resolve => {
        this.conexionesRespository
          .save(conexion)
          .then(() => {
            resolve({
              success: true,
            });
          })
          .catch(err => {
            resolve(err.message ? err.message : err);
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async delete(IDs: number[]): Promise<MutationResponse> {
    try {
      return new Promise<MutationResponse>(resolve => {
        this.conexionesRespository
          .delete(IDs)
          .then(() => {
            resolve({
              success: true,
            });
          })
          .catch(err => {
            resolve(err.message ? err.message : err);
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async getEntidadesRodas(ip: string): Promise<EntidadesRodas[]> {
    try {
      const connectionString = cloneDeep(DEFAULT_POSTGRES_CONNECTION_STRING);
      Object.defineProperties(connectionString, {
        host: {
          value: ip,
        },
        database: {
          value: 'r4_admin',
        },
      });

      const dataSource: DataSource = await new DataSource(connectionString).initialize();
      return new Promise<EntidadesRodas[]>((resolve, reject) => {
        dataSource
          .query(
            `SELECT sigla, concat(codigo, '-', nombre) as entidad
            FROM public.entidades;`,
          )
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err.message || err);
          });
      });
    } catch (err: any) {
      return Promise.reject(err.message || err);
    }
  }

  async conexionRodas(contaConexion: ContaConexionesEntity): Promise<DataSource> {
    const _conexionOptions = cloneDeep(DEFAULT_POSTGRES_CONNECTION_STRING);
    Object.defineProperties(_conexionOptions, {
      host: {
        value: contaConexion.IpRodas,
      },
      database: {
        value: `r4_${contaConexion.BaseDatos.toLowerCase()}`,
      },
    });

    const _rodasDataSource: DataSource = await new DataSource(_conexionOptions).initialize();

    return new Promise<DataSource>(resolve => {
      resolve(_rodasDataSource);
    });
  }
}
