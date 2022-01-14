import { Usuarios } from './../usuarios/usuarios.entity';
import { UsuariosService } from './../usuarios/usuarios.service';
import { UnidadesService } from './../unidades/unidades.service';
import { queryCentrosByConsolidado } from './../concilia-conta/concilia-conta.model';
import { DEFAULT_CONNECTION_STRING } from '../conexiones/conexiones.model';
import { cloneDeep } from 'lodash';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { CryptoService } from '../shared/services/crypto/crypto.service';
import { ContaConexionQueryResponse, ViewContaConexionesQueryResponse, EstadoConexionesRodasQueryResponse, EstadoConexionesRodas } from './conta-conexiones.model';
import { ContaConexiones } from './conta-conexiones.entity';
import { Injectable, Next } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class ContaConexionesService {
    constructor(
        @InjectConnection() private readonly connection: Connection,
        @InjectRepository(ContaConexiones) private readonly conexionesRespository: Repository<ContaConexiones>,
        private _cryptoService: CryptoService,
        private _unidadesSvc: UnidadesService,
        private _usuariosSvc: UsuariosService
    ) {}

    async findAll(user: Usuarios): Promise<ViewContaConexionesQueryResponse> {
        try {
            const { IdDivision, IdTipoUsuario } = user;

            let query = 'SELECT * FROM dbo.vConta_Conexiones';

            if (!this._usuariosSvc.isSuperAdmin(IdDivision, IdTipoUsuario)) {
                query += ` where IdDivision = ${ IdDivision }`;
            }

            return new Promise<ViewContaConexionesQueryResponse>(resolve => {
                this.connection.query(query).then(result => {
                    resolve({
                        success: true,
                        data: result
                    });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async findByDivision(idDivision: number): Promise<ViewContaConexionesQueryResponse> {
        try {
            return new Promise<ViewContaConexionesQueryResponse>(resolve => {
                this.connection.query(`SELECT * FROM dbo.vConta_Conexiones WHERE IdDivision = ${ idDivision }`).then(result => {
                    resolve({
                        success: true,
                        data: result
                    });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async findOne(id: number): Promise<ContaConexionQueryResponse> {
        try {
            return new Promise<ContaConexionQueryResponse>(resolve => {
                this.conexionesRespository.findOne(id).then(result => {
                    this._cryptoService.decrypt(result.Contrasena).then(res => {
                        result.Contrasena = res;

                        resolve({
                            success: true,
                            data: result
                        });
                    }).catch(err => {
                        resolve({ success: false, error: err.message ? err.message : err });
                    });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async findByIdUnidad(idUnidad: number, consolidado: boolean): Promise<ContaConexionQueryResponse> {
        // try {
            return new Promise<ContaConexionQueryResponse>((resolve, reject) => {
                this.conexionesRespository.findOne({ IdUnidad: idUnidad, Consolidado: consolidado }).then(result => {
                    if (result) {
                        resolve({
                            success: true,
                            data: result
                        });
                    } else {
                        reject(`No se ha definido la conexión al Rodas del Centro: ${ idUnidad }`);
                    }
                }).catch(err => {
                    resolve(err.message ? err.message : err);
                });
            });
        // } catch (err) {
        //     return { success: false, error: err.message ? err.message : err };
        // }
    }

    async create(conexion: ContaConexiones): Promise<MutationResponse> {
        try {
            // delete conexion.Id;

            const encryptedPassword = await this._cryptoService.encrypt(conexion.Contrasena);
            conexion.Contrasena = encryptedPassword;

            return new Promise<MutationResponse>(resolve => {
                this.conexionesRespository.save(conexion).then(result => {
                    resolve({
                        success: true
                    });
                }).catch(err => {
                    resolve(err.message ? err.message : err);
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    
    async update(conexion: ContaConexiones): Promise<MutationResponse> {
        try {
            const encryptedPassword = await this._cryptoService.encrypt(conexion.Contrasena);
            conexion.Contrasena = encryptedPassword;

            return new Promise<MutationResponse>(resolve => {
                this.conexionesRespository.save(conexion).then(result => {
                    resolve({
                        success: true
                    });
                }).catch(err => {
                    resolve(err.message ? err.message : err);
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async delete(IDs: number[]): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>(resolve => {
                this.conexionesRespository.delete(IDs).then(result => {
                    resolve({
                        success: true
                    });
                }).catch(err => {
                    resolve(err.message ? err.message : err);
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async conexionRodas(contaConexion: ContaConexiones): Promise<Connection> {
        // try {
            let _conexionOptions = cloneDeep(DEFAULT_CONNECTION_STRING);
            _conexionOptions.host = contaConexion.IpRodas;
            _conexionOptions.username = contaConexion.Usuario;
            _conexionOptions.password = await this._cryptoService.decrypt(contaConexion.Contrasena);
            _conexionOptions.database = contaConexion.BaseDatos;

            return new Promise<Connection>(resolve => {
                resolve(new Connection(_conexionOptions));
            });
        // } catch (err) {
        //     return null;
        // }
    }

    async estadoContaConexiones(idDivision: number): Promise<EstadoConexionesRodasQueryResponse> {
        try {
            const _conexionDivisionQuery = await this.findByIdUnidad(idDivision, true);

            const _conexionDivision = await (await this.conexionRodas(_conexionDivisionQuery.data)).connect();
            const _unidades = await _conexionDivision.query(queryCentrosByConsolidado);

            const _validarUnidades: EstadoConexionesRodas[] = [];

            for (let _unidad of _unidades) {
                const unidad = _unidad.Centro;
                const _conexionUnidadQuery = await this.findByIdUnidad(unidad, false);

                const datoUnidad =  await (await this._unidadesSvc.getUnidadById(unidad)).data[0];

                try {
                    await (await this.conexionRodas(_conexionUnidadQuery.data)).connect();

                    _validarUnidades.push({
                        Unidad: datoUnidad.IdUnidad + '-' + datoUnidad.Nombre,
                        Estado: 'Correcto'
                    });
                } catch (err) {
                    _validarUnidades.push({
                        Unidad: datoUnidad.IdUnidad + '-' + datoUnidad.Nombre,
                        Estado: 'Incorrecto'
                    });
                }
            }
            return new Promise<EstadoConexionesRodasQueryResponse>(resolve => {
                resolve({
                    success: true,
                    data: _validarUnidades
                });
            });

        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }
}
