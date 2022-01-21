import { MutationResponse } from './../shared/models/mutation.response.model';
import { ContaExpresionesResumen, ContaExpresionesDetalle } from './conta-expresiones.entity';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ContaExpresionesResumenQueryResponse, ContaExpresionResumenInput, ContaExpresionesDetalleQueryResponse, ContaExpresionDetalleQueryResponse, ContaExpresionDetalleInput, ContaExpresionResumenQueryResponse, ContaExpresionInput } from './conta-expresiones.model';
import { differenceBy } from 'lodash';

@Injectable()
export class ContaExpresionesService {
    constructor(
        @InjectConnection() private readonly connection: Connection,
        @InjectRepository(ContaExpresionesResumen) private readonly contaExpresionesResumenRepository: Repository<ContaExpresionesResumen>,
        @InjectRepository(ContaExpresionesDetalle) private readonly contaExpresionDetalleRepository: Repository<ContaExpresionesDetalle>
    ) {}

    async create(expresionInput: ContaExpresionInput): Promise<MutationResponse> {
        try {
            const { ExpresionResumen, ExpresionesDetalle } = expresionInput;

            delete ExpresionResumen.IdExpresion;

            return new Promise<MutationResponse>(async resolve => {
                const saveExpresionResumen = await this.createResumen(ExpresionResumen).catch(err => {
                    throw new Error(err);
                });

                ExpresionesDetalle.forEach(expr => {
                    expr.IdExpresion = saveExpresionResumen.IdExpresion;
                    this.createDetalle(expr).catch(err => {
                        throw new Error(err);
                    });
                });

                resolve({ success: true });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }
    
    async update(expresionInput: ContaExpresionInput): Promise<MutationResponse> {
        try {
            const { ExpresionResumen, ExpresionesDetalle } = expresionInput;

            return new Promise<MutationResponse>(async resolve => {
                const saveExpresionResumen = await this.updateResumen(ExpresionResumen).catch(err => {
                    throw new Error(err);
                });

                const originalExpresionDetalle = await this.findOneDetalleByResumen(saveExpresionResumen.data.IdExpresion).catch(err => {
                    throw new Error(err);
                });

                const borrarExpresionDetalle = differenceBy(originalExpresionDetalle.data, ExpresionesDetalle, 'id');

                if (borrarExpresionDetalle.length) {
                    const IDs = borrarExpresionDetalle.map(e => e.id);

                    await this.deleteDetalle(IDs).catch(err => {
                        throw new Error(err);
                    });
                }

                ExpresionesDetalle.forEach(expr => {
                    expr.IdExpresion = saveExpresionResumen.data.IdExpresion;
                    this.updateDetalle(expr).catch(err => {
                        throw new Error(err);
                    });
                });

                resolve({ success: true });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    // Expresiones Resumen
    async findAllResumen(): Promise<ContaExpresionesResumenQueryResponse> {
        try {
            return new Promise<ContaExpresionesResumenQueryResponse>(resolve => {
                this.contaExpresionesResumenRepository.find().then(result => {
                    resolve({
                        success: true,
                        data: result
                    });
                }).catch(err => {
                    throw new Error(err.message ? err.message : err);
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async findOneResumen(idExpresion: number): Promise<ContaExpresionResumenQueryResponse> {
        try {
            return new Promise<ContaExpresionResumenQueryResponse>(resolve => {
                this.contaExpresionesResumenRepository.findOne(idExpresion).then(result => {
                    resolve({
                        success: true,
                        data: result
                    });
                }).catch(err => {
                    throw new Error(err.message ? err.message : err);
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async createResumen(ExpresionesResumenInput: ContaExpresionResumenInput): Promise<ContaExpresionesResumen> {
        return new Promise<ContaExpresionesResumen>((resolve, reject) => {
            this.contaExpresionesResumenRepository.save(ExpresionesResumenInput).then(result => {
                resolve(result);
            }).catch(err => {
                reject(err.message ? err.message : err);
            });
        });
    }

    async updateResumen(ExpresionesResumenInput: ContaExpresionResumenInput): Promise<ContaExpresionResumenQueryResponse> {
        try {
            return new Promise<ContaExpresionResumenQueryResponse>(resolve => {
                this.contaExpresionesResumenRepository.save(ExpresionesResumenInput).then(result => {
                    resolve({ success: true, data: result });
                }).catch(err => {
                    throw new Error(err.message ? err.message : err);
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async deleteResumen(IDs: number[]): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>(resolve => {
                this.contaExpresionesResumenRepository.delete(IDs).then(result => {
                    resolve({ success: true });
                }).catch(err => {
                    throw new Error(err.message ? err.message : err);
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    // Expresiones Detalle
    async findAllDetalle(): Promise<ContaExpresionesDetalleQueryResponse> {
        try {
            return new Promise<ContaExpresionesDetalleQueryResponse>(resolve => {
                this.contaExpresionDetalleRepository.find().then(result => {
                    resolve({
                        success: true,
                        data: result
                    });
                }).catch(err => {
                    throw new Error(err.message ? err.message : err);
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async findOneDetalleByResumen(idExpresion: number): Promise<ContaExpresionesDetalleQueryResponse> {
        try {
            return new Promise<ContaExpresionesDetalleQueryResponse>(resolve => {
                this.contaExpresionDetalleRepository.find({ IdExpresion: idExpresion }).then(result => {
                    resolve({
                        success: true,
                        data: result
                    });
                }).catch(err => {
                    throw new Error(err.message ? err.message : err);
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async findOneDetalle(idExpresion: number): Promise<ContaExpresionDetalleQueryResponse> {
        try {
            return new Promise<ContaExpresionDetalleQueryResponse>(resolve => {
                this.contaExpresionDetalleRepository.findOne(idExpresion).then(result => {
                    resolve({
                        success: true,
                        data: result
                    });
                }).catch(err => {
                    throw new Error(err.message ? err.message : err);
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async createDetalle(expresionDetalleInput: ContaExpresionDetalleInput): Promise<MutationResponse> {
        try {
            delete expresionDetalleInput.id;

            return new Promise<MutationResponse>(resolve => {
                this.contaExpresionDetalleRepository.save(expresionDetalleInput).then(result => {
                    resolve({ success: true });
                }).catch(err => {
                    throw new Error(err.message ? err.message : err);
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async updateDetalle(expresionDetalleInput: ContaExpresionDetalleInput): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>(resolve => {
                this.contaExpresionDetalleRepository.save(expresionDetalleInput).then(result => {
                    resolve({ success: true });
                }).catch(err => {
                    throw new Error(err.message ? err.message : err);
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async deleteDetalle(idExpresion: number[]): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>(resolve => {
                this.contaExpresionDetalleRepository.delete(idExpresion).then(result => {
                    resolve({ success: true });
                }).catch(err => {
                    throw new Error(err.message ? err.message : err);
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }


}
