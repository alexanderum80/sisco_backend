import { ContaElementosGastos } from './../elementos-gastos/elementos-gastos.entity';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { ContaEgastocuenta } from './elementos-gastos-cuenta.entity';
import { ElementosGastosCuentaQueryResponse, ElementoGastoCuentaQueryResponse, ElementoGastoCuentaInput } from './elementos-gastos-cuenta.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ElementosGastosCuentaService {
    constructor(
        @InjectRepository(ContaEgastocuenta) private readonly elementoGastoCuentaRepository: Repository<ContaEgastocuenta>
    ) {}

    async getAllElementoGastoCuenta(): Promise<ElementosGastosCuentaQueryResponse> {
        return new Promise<ElementosGastosCuentaQueryResponse>((resolve) => {
            this.elementoGastoCuentaRepository.find().then(res => {
                resolve({ success: true, data: res });
            }).catch(err => {
                resolve({ success: err.message ? err.message : err });
            });
        });
    }

    async getElementoGastoCuenta(elemento: string, cuenta: string): Promise<ElementoGastoCuentaQueryResponse> {
        return new Promise<ElementoGastoCuentaQueryResponse>((resolve) => {
            this.elementoGastoCuentaRepository.findOne({ IdEGasto: elemento, Cuenta: cuenta }).then(res => {
                resolve({ success: true, data: res });
            }).catch(err => {
                resolve({ success: err.message ? err.message : err });
            });
        });
    }

    async createElementoGastoCuenta(ElementoGastoCuentaInfo: ElementoGastoCuentaInput): Promise<MutationResponse> {
        return new Promise<MutationResponse>((resolve) => {
            this.elementoGastoCuentaRepository.save(ElementoGastoCuentaInfo).then(res => {
                resolve({ success: true });
            }).catch(err => {
                resolve({ success: err.message ? err.message : err });
            });
        });
    }

    async deleteElementoGastoCuenta(elemento: string): Promise<MutationResponse> {
        return new Promise<MutationResponse>((resolve) => {
            this.elementoGastoCuentaRepository.delete({ IdEGasto: elemento }).then(res => {
                resolve({ success: true });
            }).catch(err => {
                resolve({ success: err.message ? err.message : err });
            });
        });
    }

    async actualizaElementoGastoCuenta(elementoGasto: ContaElementosGastos): Promise<MutationResponse> {
        await this.deleteElementoGastoCuenta(elementoGasto.Egasto);

        const cuentaAsociada = elementoGasto.CuentaAsociada.split(', ');

        return new Promise<MutationResponse>((resolve) => {
            cuentaAsociada.forEach(cuenta => {
                const elementoGastoCuenta: ContaEgastocuenta = {
                    IdEGasto: elementoGasto.Egasto,
                    Cuenta: cuenta,
                };

                this.createElementoGastoCuenta(elementoGastoCuenta);
            });

            resolve({ success: true });
        });
    }

}
