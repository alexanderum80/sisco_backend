import { Usuarios } from './../usuarios/usuarios.entity';
import { UsuariosService } from './../usuarios/usuarios.service';
import { DivisionesQueryResponse } from './divisiones.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Divisiones } from './divisiones.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DivisionesService {
    constructor(@InjectRepository(Divisiones) private readonly divisionesRepository: Repository<Divisiones>, private _usuariosSvc: UsuariosService) {}

    async getAllDivisiones(user: Usuarios): Promise<DivisionesQueryResponse> {
        try {
            const { IdDivision, IdTipoUsuario } = user;

            let criteria = {};

            if (!this._usuariosSvc.isSuperAdmin(IdDivision, IdTipoUsuario)) {
                criteria = [{ IdDivision: IdDivision }, { IdDivision: '101' }];
            }

            return new Promise<DivisionesQueryResponse>(resolve => {
                this.divisionesRepository
                    .find({ where: criteria })
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

    async getDivisionesActivas(): Promise<DivisionesQueryResponse> {
        try {
            return new Promise<DivisionesQueryResponse>(resolve => {
                this.divisionesRepository
                    .createQueryBuilder()
                    .where('IdDivision NOT IN (100, 120, 124)')
                    .getMany()
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

    async getDivisionById(_id: number): Promise<DivisionesQueryResponse> {
        try {
            return new Promise<DivisionesQueryResponse>(resolve => {
                this.divisionesRepository
                    .find({ where: [{ IdDivision: _id }] })
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
}
