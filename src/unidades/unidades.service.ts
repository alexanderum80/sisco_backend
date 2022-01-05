import { Usuarios } from './../usuarios/usuarios.entity';
import { UsuariosService } from './../usuarios/usuarios.service';
import { AllUnidadesQueryResponse, AllUnidadQueryResponse } from './unidades.model';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class UnidadesService {
    constructor(
        @InjectConnection() private readonly connection: Connection,
        private _usuariosSvc: UsuariosService
    ) {}

    async getAllUnidades(user: Usuarios): Promise<AllUnidadesQueryResponse> {
        try {
            const { IdDivision, IdTipoUsuario } = user;

            let query = 'select * from vCentros';

            if (!this._usuariosSvc.isSuperAdmin(IdDivision, IdTipoUsuario)) {
                query += ` where IdDivision = ${ IdDivision }`;
            }

            return new Promise<AllUnidadesQueryResponse>((resolve, reject) => {
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
            return {
                success: false,
                error: err
            };
        }
    }

    async getUnidadById(id: number): Promise<AllUnidadQueryResponse> {
        try {
            return new Promise<AllUnidadQueryResponse>((resolve, reject) => {
                this.connection.query(`select * from vCentros where IdUnidad = ${ id }`).then(result => {
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

    async getUnidadesByIdDivision(idDivision: number): Promise<AllUnidadesQueryResponse> {
        try {
            return new Promise<AllUnidadesQueryResponse>((resolve, reject) => {
                this.connection.query(`select * from vCentros where IdDivision = ${ idDivision }`).then(result => {
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
            return new Promise<any>((resolve, reject) => {
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
            return new Promise<any>((resolve, reject) => {
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
