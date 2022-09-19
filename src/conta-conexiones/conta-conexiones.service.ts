import { CentrosView } from './../unidades/unidades.entity';
import { Divisiones } from './../divisiones/divisiones.entity';
import { Usuarios } from './../usuarios/usuarios.entity';
import { UsuariosService } from './../usuarios/usuarios.service';
import { UnidadesService } from './../unidades/unidades.service';
import { queryCentrosByConsolidado } from './../concilia-conta/concilia-conta.model';
import { DEFAULT_CONNECTION_STRING } from '../conexiones/conexiones.model';
import { cloneDeep } from 'lodash';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { CryptoService } from '../shared/services/crypto/crypto.service';
import { ContaConexionQueryResponse, EstadoConexionesRodasQueryResponse, EstadoConexionesRodas, ContaConexionesQueryResponse, ContaConexionInput } from './conta-conexiones.model';
import { ContaConexiones } from './conta-conexiones.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ContaConexionesService {
    constructor(
        @InjectRepository(ContaConexiones) private readonly conexionesRespository: Repository<ContaConexiones>,
        private _cryptoService: CryptoService,
        private _unidadesSvc: UnidadesService,
        private _usuariosSvc: UsuariosService,
    ) {}

    async findAll(user: Usuarios): Promise<ContaConexionesQueryResponse> {
        try {
            const { IdDivision, IdTipoUsuario } = user;

            let _condition = {};

            if (!this._usuariosSvc.isSuperAdmin(IdDivision, IdTipoUsuario)) {
                _condition = { IdDivision: IdDivision };
            }

            return new Promise<ContaConexionesQueryResponse>(resolve => {
                this.conexionesRespository
                    .createQueryBuilder('con')
                    .select('con.Id', 'Id')
                    .addSelect('con.IdUnidad', 'IdUnidad')
                    .addSelect('con.IdDivision', 'IdDivision')
                    .addSelect('con.Consolidado', 'Consolidado')
                    .addSelect('con.IpRodas', 'IpRodas')
                    .addSelect('con.Usuario', 'Usuario')
                    .addSelect('con.BaseDatos', 'BaseDatos')
                    .addSelect("Concat(centros.IdUnidad, '-', centros.Nombre)", 'Unidad')
                    .addSelect("Concat(div.IdDivision, '-', div.Division)", 'Division')
                    .innerJoin(CentrosView, 'centros', 'centros.IdUnidad = con.IdUnidad')
                    .innerJoin(Divisiones, 'div', 'div.IdDivision = centros.IdDivision')
                    .where(_condition)
                    .execute()
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

    async findOne(id: number): Promise<ContaConexionQueryResponse> {
        try {
            return new Promise<ContaConexionQueryResponse>(resolve => {
                this.conexionesRespository
                    .findOne({ where: [{ Id: id }] })
                    .then(result => {
                        this._cryptoService
                            .decrypt(result.Contrasena)
                            .then(res => {
                                result.Contrasena = res;

                                resolve({
                                    success: true,
                                    data: result,
                                });
                            })
                            .catch(err => {
                                resolve({ success: false, error: err.message ? err.message : err });
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

    async findByIdUnidad(idUnidad: number, consolidado: boolean): Promise<ContaConexionQueryResponse> {
        return new Promise<ContaConexionQueryResponse>((resolve, reject) => {
            this.conexionesRespository
                .findOne({ where: [{ IdUnidad: idUnidad, Consolidado: consolidado }] })
                .then(result => {
                    if (result) {
                        resolve({
                            success: true,
                            data: result,
                        });
                    } else {
                        reject(`No se ha definido la conexión al Rodas del Centro: ${idUnidad}`);
                    }
                })
                .catch(err => {
                    resolve(err.message ? err.message : err);
                });
        });
    }

    async create(conexion: ContaConexionInput): Promise<MutationResponse> {
        try {
            delete conexion.Id;

            const encryptedPassword = await this._cryptoService.encrypt(conexion.Contrasena);
            conexion.Contrasena = encryptedPassword;

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
            const encryptedPassword = await this._cryptoService.encrypt(conexion.Contrasena);
            conexion.Contrasena = encryptedPassword;

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

    async conexionRodas(contaConexion: ContaConexiones): Promise<DataSource> {
        const _conexionOptions = cloneDeep(DEFAULT_CONNECTION_STRING);
        Object.defineProperties(_conexionOptions, {
            host: {
                value: contaConexion.IpRodas,
            },
            username: {
                value: contaConexion.Usuario,
            },
            password: {
                value: await this._cryptoService.decrypt(contaConexion.Contrasena),
            },
            database: {
                value: contaConexion.BaseDatos,
            },
        });

        const _rodasConnection: DataSource = await new DataSource(_conexionOptions).initialize();

        return new Promise<DataSource>(resolve => {
            resolve(_rodasConnection);
        });
    }

    async estadoContaConexiones(idDivision: number): Promise<EstadoConexionesRodasQueryResponse> {
        try {
            const _conexionDivisionQuery = await this.findByIdUnidad(idDivision, true);

            const _conexionDivision = await (await this.conexionRodas(_conexionDivisionQuery.data)).initialize();
            const _unidades = await _conexionDivision.query(queryCentrosByConsolidado);

            const _validarUnidades: EstadoConexionesRodas[] = [];

            for (const _unidad of _unidades) {
                const unidad = _unidad.Centro;
                const _conexionUnidadQuery = await this.findByIdUnidad(unidad, false);

                const datoUnidad = await (await this._unidadesSvc.getUnidadById(unidad)).data[0];

                try {
                    await (await this.conexionRodas(_conexionUnidadQuery.data)).initialize();

                    _validarUnidades.push({
                        Unidad: datoUnidad.IdUnidad + '-' + datoUnidad.Nombre,
                        Estado: 'Correcto',
                    });
                } catch (err: any) {
                    _validarUnidades.push({
                        Unidad: datoUnidad.IdUnidad + '-' + datoUnidad.Nombre,
                        Estado: 'Incorrecto',
                    });
                }
            }
            return new Promise<EstadoConexionesRodasQueryResponse>(resolve => {
                resolve({
                    success: true,
                    data: _validarUnidades,
                });
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }
}
