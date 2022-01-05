import { ContaEgastocuenta } from './../elementos-gastos-cuenta/elementos-gastos-cuenta.entity';
import { ElementosGastosCuentaService } from './../elementos-gastos-cuenta/elementos-gastos-cuenta.service';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { ElementosGastosQueryResponse, ElementoGastoQueryResponse, ElementoGastoInput } from './elementos-gastos.model';
import { ContaElementosGastos } from './elementos-gastos.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ElementosGastosService {
    constructor(
        @InjectRepository(ContaElementosGastos) private readonly elementosGastosRepository: Repository<ContaElementosGastos>,
        private elementoGastoCuentaSvc: ElementosGastosCuentaService
    ) { }

    async getAllElementoGastos(): Promise<ElementosGastosQueryResponse> {
        try {
            return new Promise<ElementosGastosQueryResponse>((resolve, reject) => {
                this.elementosGastosRepository.find().then(result => {
                    resolve({
                        success: true,
                        data: result
                    });
                })
                .catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async getElementoGastoById(id: string): Promise<ElementoGastoQueryResponse> {
        try {
            return new Promise<ElementoGastoQueryResponse>((resolve, reject) => {
                this.elementosGastosRepository.findOne({ Egasto : id }).then(result => {
                    resolve({
                        success: true,
                        data: result
                    });
                })
                .catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async saveElementoGasto(elementoGastoInfo: ElementoGastoInput): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>((resolve, reject) => {
                this.elementosGastosRepository.save(elementoGastoInfo).then(result => {
                    this.elementoGastoCuentaSvc.actualizaElementoGastoCuenta(result).then(() => {
                        resolve({ success: true });
                    });
                })
                .catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async deleteElementoGasto(id: string): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>((resolve, reject) => {
                this.elementosGastosRepository.delete(id).then(() => {
                    this.elementoGastoCuentaSvc.deleteElementoGastoCuenta(id).then(result => {
                        if (!result.success) {
                            resolve({ success: false, error: result.error });
                        } else {
                            resolve({ success: true });
                        }
                    });
                })
                .catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

}
