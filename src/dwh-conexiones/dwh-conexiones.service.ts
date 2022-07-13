import { DEFAULT_CONNECTION_STRING } from '../conexiones/conexiones.model';
import { DWHConexionQueryResponse, DWHConexionesInput } from './dwh-conexiones.model';
import { CryptoService } from '../shared/services/crypto/crypto.service';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { DWHConexiones } from './dwh-conexiones.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { cloneDeep } from 'lodash';

@Injectable()
export class DwhConexionesService {
    EMPRESA_CODIGO = 100;

    constructor(
        @InjectRepository(DWHConexiones) private readonly dwhConexionesRepository: Repository<DWHConexiones>,
        private _cryptoService: CryptoService,
    ) {}

    async DWHConexion(idDivision: number): Promise<DWHConexionQueryResponse> {
        try {
            return new Promise<DWHConexionQueryResponse>(resolve => {
                this.dwhConexionesRepository.findOne(idDivision).then(result => {
                    resolve({
                        success: true,
                        data: result
                    });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async getDWHConexion(idDivision: number): Promise<DWHConexionQueryResponse> {
        try {
            const _dwhConexion = await this.dwhConexionesRepository.findOneOrFail(idDivision);
            _dwhConexion.ConexionDWH = await this._omitirDatosInnecesarios(_dwhConexion.ConexionDWH!);
            _dwhConexion.ConexionRest = await this._omitirDatosInnecesarios(_dwhConexion.ConexionRest!);

            return new Promise<DWHConexionQueryResponse>(resolve => {
                resolve({
                    success: true,
                    data: _dwhConexion
                });
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    private async _omitirDatosInnecesarios(conexion: string) {
        let _newConexion = {
            Server: '',
            User: '',
            Database: '',
            Password: ''
        };

        if (conexion) {
            const _conexion = JSON.parse(await this._cryptoService.decrypt(conexion));
            _newConexion = {
                Server: _conexion.host,
                User: _conexion.username,
                Database: _conexion.database,
                Password: _conexion.password
            };
        }

        return JSON.stringify(_newConexion);
    }

    async updateDWhConexion(dwhConexionInput: DWHConexionesInput): Promise<MutationResponse> {
        try {
            const dwhConexion = await this.DWHConexionString(dwhConexionInput);

            dwhConexion.ConexionDWH = await this._cryptoService.encrypt(Buffer.from(dwhConexion.ConexionDWH!).toString());
            dwhConexion.ConexionRest = await this._cryptoService.encrypt(Buffer.from(dwhConexion.ConexionRest!).toString());

            return new Promise<MutationResponse>(resolve => {
                this.dwhConexionesRepository.save(dwhConexion).then(() => {
                    resolve({ success: true });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    private async DWHConexionString(dwhConexionInput: DWHConexionesInput): Promise<DWHConexiones> {
        const _conexionDWH = cloneDeep(DEFAULT_CONNECTION_STRING);
        Object.defineProperties(_conexionDWH, {
            host: {
                value: dwhConexionInput.DWH_ip
            },
            username: {
                value: dwhConexionInput.DWH_usuario
            },
            password: {
                value: await this._cryptoService.decrypt(dwhConexionInput.DWH_contrasena)
            },
            database: {
                value: dwhConexionInput.DWH_baseDatos
            }
        })

        const _conexionRest = cloneDeep(DEFAULT_CONNECTION_STRING);
        Object.defineProperties(_conexionRest, {
            host: {
                value: dwhConexionInput.Rest_ip
            },
            username: {
                value: dwhConexionInput.Rest_usuario
            },
            password: {
                value: await this._cryptoService.decrypt(dwhConexionInput.Rest_contrasena)
            },
            database: {
                value: dwhConexionInput.Rest_baseDatos
            }
        })

        const dwhConexion: DWHConexiones = {
            IdUnidad: dwhConexionInput.IdUnidad,
            ConexionDWH: JSON.stringify(_conexionDWH),
            ConexionRest: JSON.stringify(_conexionRest),
        };

        return dwhConexion;
    }

    async conexionDWH(connectionString: string): Promise<Connection> {
        const _connectionOptions = JSON.parse(await this._cryptoService.decrypt(connectionString));

        return new Connection(_connectionOptions);
    }

    async conexionRestEmpresa(): Promise<Connection> {
        const _connectionQuery = await this.DWHConexion(this.EMPRESA_CODIGO);
        if (!_connectionQuery.success) {
            return new Connection(DEFAULT_CONNECTION_STRING);
        }

        return await this.conexionDWH(_connectionQuery.data!.ConexionRest!);
    }

    async conexionDWHEmpresa(): Promise<Connection> {
        const _connectionQuery = await this.DWHConexion(this.EMPRESA_CODIGO);
        if (!_connectionQuery.success) {
            return new Connection(DEFAULT_CONNECTION_STRING);
        }

        return await this.conexionDWH(_connectionQuery.data!.ConexionDWH!);
    }

}
