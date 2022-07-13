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
    ) { }

    async getAllElementoGastos(): Promise<ElementosGastosQueryResponse> {
        try {
            return new Promise<ElementosGastosQueryResponse>(resolve => {
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
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async getElementoGastoById(id: string): Promise<ElementoGastoQueryResponse> {
        try {
            return new Promise<ElementoGastoQueryResponse>(resolve => {
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
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async saveElementoGasto(elementoGastoInfo: ElementoGastoInput): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>(resolve => {
                this.elementosGastosRepository.save(elementoGastoInfo).then(() => {
                    resolve({ success: true });
                })
                .catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async deleteElementoGasto(id: string): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>(resolve => {
                this.elementosGastosRepository.delete(id).then(() => {
                    resolve({ success: true });
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
