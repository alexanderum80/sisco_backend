import { Usuarios } from './../usuarios/usuarios.entity';
import { UsuariosService } from './../usuarios/usuarios.service';
import { AllUnidadesQueryResponse, AllUnidadQueryResponse } from './unidades.model';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, getManager } from 'typeorm';
import { CentrosView } from './unidades.entity';

@Injectable()
export class UnidadesService {
    constructor(
        @InjectConnection() private readonly connection: Connection,
        private _usuariosSvc: UsuariosService
    ) {}

    async getAllUnidades(user: Usuarios): Promise<AllUnidadesQueryResponse> {
        try {
            const { IdDivision, IdTipoUsuario } = user;

            let _condition = { };

            if (!this._usuariosSvc.isSuperAdmin(IdDivision, IdTipoUsuario)) {
                _condition = { IdDivision: IdDivision };
            }

            const entityManager = getManager();

            return new Promise<AllUnidadesQueryResponse>(resolve => {
                entityManager.find(CentrosView, { where: _condition }).then(result => {
                    resolve({
                        success: true,
                        data: result
                    });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err) {
            return {
                success: false,
                error: err
            };
        }
    }

    async getUnidadById(IdUnidad: number): Promise<AllUnidadQueryResponse> {
        try {
            const entityManager = getManager();

            return new Promise<AllUnidadQueryResponse>(resolve => {
                entityManager.findOne(CentrosView, { where: { IdUnidad } }).then(result => {
                    resolve({
                        success: true,
                        data: result
                    });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err) {
            return {
                success: false,
                error: err
            };
        }
    }

    async getUnidadesByIdDivision(IdDivision: number): Promise<AllUnidadesQueryResponse> {
        try {
            const entityManager = getManager();

            return new Promise<AllUnidadesQueryResponse>(resolve => {
                entityManager.findOne(CentrosView, { where: { IdDivision } }).then(result => {
                    resolve({
                        success: true,
                        data: result
                    });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err) {
            return {
                success: false,
                error: err
            };
        }
    }

    async getUnidadesAbiertasByIdSubdivision(idSubdivision: number): Promise<any> {
        try {
            return new Promise<any>(resolve => {
                this.connection.query(`Select U.*, D.Division from Unidades AS U INNER JOIN dbo.Divisiones AS D ON D.IdDivision = U.IdDivision
                        WHERE (case isnull(IdComplejo,0) when 0 THEN IdUnidad else IdComplejo end) = ${ idSubdivision }
                        AND Abierta = 1 order by Idunidad`).then(result => {
                    resolve({
                        success: true,
                        data: result
                    });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err) {
            return {
                success: false,
                error: err
            };
        }
    }

    async getUnidadesAbiertasByIdDivision(idDivision: number): Promise<any> {
        try {
            return new Promise<any>(resolve => {
                this.connection.query(`Select U.*, D.Division from Unidades AS U INNER JOIN dbo.Divisiones AS D ON D.IdDivision = U.IdDivision
                        WHERE U.IdDivision = ${ idDivision }
                        AND Abierta = 1 order by Idunidad`).then(result => {
                    resolve({
                        success: true,
                        data: result
                    });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err) {
            return {
                success: false,
                error: err
            };
        }
    }

}
