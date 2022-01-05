import { MutationResponse } from './../shared/models/mutation.response.model';
import { ContaExpresionesResumen, ContaExpresionesDetalle } from './conta-expresiones.entity';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ContaExpresionesResumenQueryResponse, ContaExpresionResumenInput, ContaExpresionesDetalleQueryResponse, ContaExpresionDetalleQueryResponse, ContaExpresionDetalleInput, ContaExpresionResumenQueryResponse, ContaExpresionInput } from './conta-expresiones.model';
import { differenceBy } from 'lodash';
import { Usuarios } from 'src/usuarios/usuarios.entity';

@Injectable()
export class ContaExpresionesService {
    constructor(
        @InjectConnection() private readonly connection: Connection,
        @InjectRepository(ContaExpresionesResumen) private readonly contaExpresionesResumenRepository: Repository<ContaExpresionesResumen>,
        @InjectRepository(ContaExpresionesDetalle) private readonly contaExpresionDetalleRepository: Repository<ContaExpresionesDetalle>
    ) {}

    async saveExpresion(usuario: Usuarios,  expresionInput: ContaExpresionInput): Promise<MutationResponse> {
        try {
            const { ExpresionResumen, ExpresionesDetalle } = expresionInput;

            ExpresionResumen.Centralizada = usuario.IdDivision === 100 && (usuario.IdTipoUsuario === 1 || usuario.IdTipoUsuario === 3);

            return new Promise<MutationResponse>(async resolve => {
                const saveExpresionResumen = await this.saveExpresionResumen(ExpresionResumen).catch(err => {
                    throw new Error(err);
                });

                const originalExpresionDetalle = await this.getExpresionesDetalleByIdResumen(saveExpresionResumen.data.IdExpresion).catch(err => {
                    throw new Error(err);
                });

                const borrarExpresionDetalle = differenceBy(originalExpresionDetalle.data, ExpresionesDetalle, 'id');

                if (borrarExpresionDetalle.length) {
                    const IDs = borrarExpresionDetalle.map(e => e.id);

                    await this.deleteExpresionDetalle(IDs).catch(err => {
                        throw new Error(err);
                    });
                }

                ExpresionesDetalle.forEach(expr => {
                    expr.IdExpresion = saveExpresionResumen.data.IdExpresion;
                    this.saveExpresionDetalle(expr).catch(err => {
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
    async getAllExpresionesResumen(): Promise<ContaExpresionesResumenQueryResponse> {
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

    async getExpresionResumenById(idExpresion: number): Promise<ContaExpresionResumenQueryResponse> {
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

    async saveExpresionResumen(ExpresionesResumenInput: ContaExpresionResumenInput): Promise<ContaExpresionResumenQueryResponse> {
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

    async deleteExpresionResumen(idExpresion: number): Promise<MutationResponse> {
        try {
            return new Promise<MutationResponse>(resolve => {
                this.contaExpresionesResumenRepository.delete(idExpresion).then(result => {
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
    async getAllExpresionesDetalle(): Promise<ContaExpresionesDetalleQueryResponse> {
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

    async getExpresionesDetalleByIdResumen(idExpresion: number): Promise<ContaExpresionesDetalleQueryResponse> {
        try {
            return new Promise<ContaExpresionesDetalleQueryResponse>(resolve => {
                // this.connection.query(`select * from vConta_ExpresionesDetalle where IdExpresion = ${ idExpresion }`).then(result => {
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

    async getExpresionDetalleById(idExpresion: number): Promise<ContaExpresionDetalleQueryResponse> {
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

    async saveExpresionDetalle(expresionDetalleInput: ContaExpresionDetalleInput): Promise<MutationResponse> {
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

    async deleteExpresionDetalle(idExpresion: number[]): Promise<MutationResponse> {
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
