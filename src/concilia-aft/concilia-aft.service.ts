import { cloneDeep, padStart, toNumber } from 'lodash';
import { XmlJsService } from './../shared/services/xml-js/xml-js.service';
import { ConciliaContaService } from './../concilia-conta/concilia-conta.service';
import { ContaConexionesService } from './../conta-conexiones/conta-conexiones.service';
import {
    ConciliaAftInput,
    queryMbClanaCNMB,
    ConciliaAftData,
    DiferenciaClasificadorCNMB,
    queryMbUltimoPeriodo,
    queryMbSinCuentas,
    queryMbPeriodo,
    queryMb,
    querySiscoUltimoPeriodoMB,
} from './concilia-aft.model';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ContaConexionesEntity } from './../conta-conexiones/conta-conexiones.entity';

@Injectable()
export class ConciliaAftService {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private _contaConexionesSvc: ContaConexionesService,
        private _conciliaContaSvc: ConciliaContaService,
        private _xmlSvc: XmlJsService,
    ) {}

    async concilia(conciliaAftInput: ConciliaAftInput): Promise<ConciliaAftData> {
        try {
            const { idCentro, annio, periodo } = conciliaAftInput;

            // verificar si se ha definido la conexión al Rodas
            const _conexionRodasQuery = await this._contaConexionesSvc.findByIdUnidad(idCentro, false);
            const _conexionConta = _conexionRodasQuery.data;
            _conexionConta.BaseDatos = _conexionConta.BaseDatos.substring(0, _conexionConta.BaseDatos.length - 4) + annio.toString();

            const _conexionMB = cloneDeep(_conexionConta);
            _conexionMB.BaseDatos = _conexionMB.BaseDatos.replace(/Conta/gi, 'MB');

            return new Promise<ConciliaAftData>(async (resolve, reject) => {
                // importo los datos de los activos
                this._importarDatosAF(idCentro, periodo, _conexionMB)
                    .then(res => {
                        // chequeo si hay diferencias en el clasificador CNMB
                        if ((res as DiferenciaClasificadorCNMB[]).length) {
                            resolve({ DiferenciaClasificadorCNMB: res as DiferenciaClasificadorCNMB[] });
                        } else {
                            // importo los datos de la contabilidad
                            this._importarDatosRodas(annio, periodo, idCentro, 0, _conexionConta)
                                .then(() => {
                                    // calculo la conciliacion
                                    this._calculaConciliacion(idCentro, annio, periodo).then(res => {
                                        resolve(res);
                                    });
                                })
                                .catch(err => {
                                    return reject(err.message || err);
                                });
                        }
                    })
                    .catch(err => {
                        reject(err.message || err);
                    });
            });
        } catch (err) {
            throw new Error(err.message || err);
        }
    }

    private async _importarDatosAF(idCentro: number, periodo: number, conexionRodas: ContaConexionesEntity): Promise<void | DiferenciaClasificadorCNMB[]> {
        const mbConnection = await this._contaConexionesSvc.conexionRodas(conexionRodas);

        return new Promise<void | DiferenciaClasificadorCNMB[]>(async (resolve, reject) => {
            // importo el clasificador CNMB
            this._importarCnmbAF(idCentro, mbConnection)
                .then(_clasifCNMB => {
                    // compruebo si hay diferencias en el caslificador CNMB
                    if (_clasifCNMB.length) return resolve(_clasifCNMB);
                    // importo los MB
                    else
                        this._importarMbAF(idCentro, periodo, mbConnection)
                            .then(() => {
                                resolve([]);
                            })
                            .catch(err => {
                                reject(err.message || err);
                            });
                })
                .catch(err => {
                    reject(err.message || err);
                });
        });
    }

    private async _importarCnmbAF(idCentro: number, conexionRodas: DataSource): Promise<DiferenciaClasificadorCNMB[]> {
        return new Promise<DiferenciaClasificadorCNMB[]>((resolve, reject) => {
            conexionRodas
                .query(queryMbClanaCNMB)
                .then(async res => {
                    if (res.length) {
                        const _cnmb = this._xmlSvc.jsonToXML('CNMB', res);

                        this.dataSource
                            .query(`EXEC dbo.pAF_ImportClanaCnmbXML @0, @1`, [_cnmb, idCentro])
                            .then(res => {
                                resolve(res);
                            })
                            .catch(err => {
                                reject(err.message ? err.message : err);
                            });
                    }
                })
                .catch((err: Error) => {
                    reject(err.message || err);
                });
        });
    }

    private async _importarMbAF(idCentro: number, periodo: number, conexionRodas: DataSource): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            // chequeo si el periodo es correcto
            this._chequeaUltimoPeriodo(periodo, conexionRodas)
                .then(() => {
                    // chequeo si todos los MB tienen cuentas
                    this._chequeaMbSinCuentas(conexionRodas)
                        .then(() => {
                            // importo los MB
                            this._importarMb(idCentro, periodo, conexionRodas)
                                .then(() => {
                                    resolve();
                                })
                                .catch(err => {
                                    reject(err.message || err);
                                });
                        })
                        .catch(err => {
                            reject(err.message || err);
                        });
                })
                .catch(err => {
                    reject(err.message || err);
                });
        });
    }

    private async _chequeaUltimoPeriodo(periodo: number, conexionRodas: DataSource): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            conexionRodas
                .query(queryMbUltimoPeriodo)
                .then(per => {
                    const periodoActual = toNumber(per[0].Periodo) + 1;
                    if (periodoActual !== 0 && periodo > periodoActual) {
                        return reject('No existen datos de los Activos Fijos para el período que está analizando. Seleccione un período anterior.');
                    }
                    resolve(periodoActual);
                })
                .catch((err: Error) => {
                    reject(err.message || err);
                });
        });
    }

    private async _chequeaMbSinCuentas(conexionRodas: DataSource): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            conexionRodas
                .query(queryMbSinCuentas)
                .then(res => {
                    if (res.length) {
                        return reject(
                            `Los siguientes AFT no tienen cuenta de Inventario o de Depreciación. Debe corregir estos medios para poder realizar la conciliación. 
                            Números de Inventario: ${res.join(', ')}`,
                        );
                    }
                    resolve(true);
                })
                .catch((err: Error) => {
                    reject(err.message || err);
                });
        });
    }

    private async _importarMb(idCentro: number, periodo: number, conexionRodas: DataSource): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            // leo primero de la tabla MB_Periodo
            const ultimoPeriodoResp = await this.dataSource
                .query(querySiscoUltimoPeriodoMB.replace(/@Centro/gi, idCentro.toString()))
                .then(async per => {
                    return per;
                })
                .catch(err => reject(err));

            let periodoActual = toNumber(ultimoPeriodoResp[0].Periodo);
            if (periodoActual > periodo) periodoActual = periodo;

            for (let per = periodoActual; per <= periodo; per++) {
                let _mb: string;
                let _query = await conexionRodas
                    .query(queryMbPeriodo.replace(/@Centro/gi, idCentro.toString()).replace(/@Periodo/gi, padStart(per.toString(), 2, '0')))
                    .then(res => {
                        if (res.length) {
                            _mb = this._xmlSvc.jsonToXML('MB', res);
                        }
                        return _mb;
                    })
                    .catch((err: Error) => {
                        return reject(err.message || err);
                    });
                if (!_query) {
                    _query = await conexionRodas
                        .query(queryMb.replace(/@Centro/gi, idCentro.toString()).replace(/@Periodo/gi, padStart(per.toString(), 2, '0')))
                        .then(res => {
                            if (res.length) {
                                _mb = this._xmlSvc.jsonToXML('MB', res);
                            }
                            return _mb;
                        })
                        .catch((err: Error) => {
                            return reject(err.message || err);
                        });
                }
                if (_query) {
                    // inserto los MB
                    await this.dataSource
                        .query(`EXEC dbo.pAF_ImportMbXML @0, @1, @2`, [_query, idCentro, per])
                        .then(() => {
                            return;
                        })
                        .catch(err => {
                            throw new Error(err.message ? err.message : err);
                        });
                }
            }

            resolve(true);
        });
    }

    private async _importarDatosRodas(annio: number, periodo: number, idUnidad: number, tipoCentro: number, contaConexion: ContaConexionesEntity): Promise<boolean> {
        const cons = tipoCentro === 1 ? '1' : '0';

        // me conecto al Rodas del Centro
        const rodasConnection = await this._contaConexionesSvc.conexionRodas(contaConexion);

        // importo los asientos del rodas
        await this._conciliaContaSvc.importarContabilidad(idUnidad, annio, periodo, cons, rodasConnection).catch(err => {
            throw new Error(err.message || err);
        });
        // if (!_importarAsientoRodas.success) {
        //     return { success: false, error: _importarAsientoRodas.error + ' No se pudo importar Asientos del Rodas de la Unidad ' + idUnidad };
        // }

        return new Promise<boolean>(resolve => {
            resolve(true);
        });
    }

    private _calculaConciliacion(idCentro: number, annio: number, periodo: number): Promise<ConciliaAftData> {
        return new Promise<ConciliaAftData>((resolve, reject) => {
            this.dataSource
                .query(`EXEC pAF_CalculaConciliacion @0, @1, @2`, [idCentro, annio, periodo])
                .then(res => {
                    resolve({
                        ConciliaAFT: res,
                    });
                })
                .catch(err => {
                    reject(err.message || err);
                });
        });
    }
}
