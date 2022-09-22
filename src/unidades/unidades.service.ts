import { Usuarios } from './../usuarios/usuarios.entity';
import { UsuariosService } from './../usuarios/usuarios.service';
import { AllUnidadesQueryResponse, AllUnidadQueryResponse } from './unidades.model';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CentrosView } from './unidades.entity';

@Injectable()
export class UnidadesService {
    constructor(@InjectDataSource() private readonly dataSource: DataSource, private _usuariosSvc: UsuariosService) {}

    async getAllUnidades(user: Usuarios): Promise<AllUnidadesQueryResponse> {
        try {
            const { IdDivision, IdTipoUsuario } = user;

            let _condition = {};

            if (!this._usuariosSvc.isSuperAdmin(IdDivision, IdTipoUsuario) && !this._usuariosSvc.isAdvancedUser(IdDivision, IdTipoUsuario)) {
                _condition = { IdDivision: IdDivision };
            }

            return new Promise<AllUnidadesQueryResponse>(resolve => {
                this.dataSource.manager
                    .find(CentrosView, { where: _condition })
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

    async getUnidadById(IdUnidad: number): Promise<AllUnidadQueryResponse> {
        try {
            return new Promise<AllUnidadQueryResponse>(resolve => {
                this.dataSource.manager
                    .findOne(CentrosView, { where: { IdUnidad } })
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

    async getUnidadesByIdSubdivision(IdSubdivision: number): Promise<AllUnidadesQueryResponse> {
        try {
            return new Promise<AllUnidadesQueryResponse>(resolve => {
                this.dataSource.manager
                    .find(CentrosView, { where: { IdSubdivision } })
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

    async getUnidadesByIdDivision(IdDivision: number): Promise<AllUnidadesQueryResponse> {
        try {
            return new Promise<AllUnidadesQueryResponse>(resolve => {
                this.dataSource.manager
                    .find(CentrosView, { where: { IdDivision } })
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

    async getUnidadesAbiertasByIdSubdivision(idSubdivision: number): Promise<any> {
        try {
            return new Promise<any>(resolve => {
                this.dataSource
                    .query(
                        `Select U.*, D.Division from Unidades AS U INNER JOIN dbo.Divisiones AS D ON D.IdDivision = U.IdDivision
                        WHERE (case isnull(IdComplejo,0) when 0 THEN IdUnidad else IdComplejo end) = ${idSubdivision}
                        AND Abierta = 1 order by Idunidad`,
                    )
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

    async getUnidadesAbiertasByIdDivision(idDivision: number): Promise<any> {
        try {
            return new Promise<any>(resolve => {
                this.dataSource
                    .query(
                        `Select U.*, D.Division from Unidades AS U INNER JOIN dbo.Divisiones AS D ON D.IdDivision = U.IdDivision
                        WHERE U.IdDivision = ${idDivision}
                        AND Abierta = 1 order by Idunidad`,
                    )
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
}
