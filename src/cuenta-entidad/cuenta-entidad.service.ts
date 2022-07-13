import { MutationResponse } from './../shared/models/mutation.response.model';
import { CuentasEntidadQueryResponse, CuentaEntidadQueryResponse, ContaCuentaEntidadInput } from './cuenta-entidad.model';
import { ContaCuentaentidad } from './cuenta-entidad.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClasificadorCuentaReal } from './../clasificador-cuenta/clasificador-cuenta.entity';

@Injectable()
export class CuentaEntidadService {
    constructor(
        @InjectRepository(ContaCuentaentidad) private readonly cuentaEntidadRepository: Repository<ContaCuentaentidad>
    ) {}

    async getAllCuentaEntidad(): Promise<CuentasEntidadQueryResponse> {
        return new Promise<CuentasEntidadQueryResponse>((resolve) => {
            this.cuentaEntidadRepository.find().then(res => {
                resolve({ success: true, data: res });
            }).catch(err => {
                resolve({ success: err.message ? err.message : err });
            });
        });
    }

    async getCuentaEntidad(cuenta: string, subcuenta: string, tipo: number): Promise<CuentaEntidadQueryResponse> {
        return new Promise<CuentaEntidadQueryResponse>((resolve) => {
            this.cuentaEntidadRepository.findOne({ Cuenta: cuenta, SubCuenta: subcuenta, TipoClasificador: tipo }).then(res => {
                resolve({ success: true, data: res });
            }).catch(err => {
                resolve({ success: err.message ? err.message : err });
            });
        });
    }

    async saveCuentaEntidad(cuentaEntidadInfo: ContaCuentaEntidadInput): Promise<MutationResponse> {
        return new Promise<MutationResponse>((resolve) => {
            this.cuentaEntidadRepository.save(cuentaEntidadInfo).then(() => {
                resolve({ success: true });
            }).catch(err => {
                resolve({ success: err.message ? err.message : err });
            });
        });
    }

    async deleteCuentaEntidad(cuenta: string, subcuenta: string, tipo: number): Promise<MutationResponse> {
        return new Promise<MutationResponse>((resolve) => {
            this.cuentaEntidadRepository.delete({ Cuenta: cuenta, SubCuenta: subcuenta, TipoClasificador: tipo }).then(() => {
                resolve({ success: true });
            }).catch(err => {
                resolve({ success: err.message ? err.message : err });
            });
        });
    }

    async actualizaCuentaEntidad(clasificadorCuenta: ClasificadorCuentaReal): Promise<MutationResponse> {
        await this.deleteCuentaEntidad(clasificadorCuenta.Cuenta, clasificadorCuenta.SubCuenta, clasificadorCuenta.TipoClasificador);

        const seUtiliza = clasificadorCuenta.SeUtiliza!.split(', ');

        return new Promise<MutationResponse>((resolve) => {
            seUtiliza.forEach(entidad => {
                const cuentaEntidad: ContaCuentaentidad = {
                    Cuenta: clasificadorCuenta.Cuenta,
                    SubCuenta: clasificadorCuenta.SubCuenta,
                    TipoEntidad: Number(entidad),
                    TipoClasificador: clasificadorCuenta.TipoClasificador
                };

                this.saveCuentaEntidad(cuentaEntidad);
            });

            resolve({ success: true });
        });
    }

}
