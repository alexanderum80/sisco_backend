import { ContaConexionesEntity } from './../conta-conexiones/conta-conexiones.entity';
import { cloneDeep, toNumber } from 'lodash';
import { ConciliaUhInput, ConciliaUH, queryUhCategorias, queryUhUltimoPeriodo, queryUhSinCuentas, querySiscoUltimoPeriodoUH, queryUhHistorial, queryUh } from './concilia-uh.model';
import { XmlJsService } from './../shared/services/xml-js/xml-js.service';
import { ConciliaContaService } from './../concilia-conta/concilia-conta.service';
import { ContaConexionesService } from './../conta-conexiones/conta-conexiones.service';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ConciliaUhService {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private _contaConexionesSvc: ContaConexionesService,
        private _conciliaContaSvc: ConciliaContaService,
        private _xmlSvc: XmlJsService,
    ) {}

    async concilia(conciliaUhInput: ConciliaUhInput): Promise<ConciliaUH[]> {
        try {
            const { idCentro, annio, periodo } = conciliaUhInput;

            // verificar si se ha definido la conexión al Rodas
            const _conexionRodasQuery = await this._contaConexionesSvc.findByIdUnidad(idCentro, false);
            const _conexionConta = _conexionRodasQuery.data;
            _conexionConta.BaseDatos = _conexionConta.BaseDatos.substring(0, _conexionConta.BaseDatos.length - 4) + annio.toString();

            const _conexionMB = cloneDeep(_conexionConta);
            _conexionMB.BaseDatos = _conexionMB.BaseDatos.replace(/Conta/gi, 'UH');

            return new Promise<ConciliaUH[]>(async (resolve, reject) => {
                // importo los datos de los activos
                await this._importarDatosUH(idCentro, periodo, _conexionMB).catch(err => {
                    return reject(err.message || err);
                });

                // importo los datos de la contabilidad
                await this._importarDatosRodas(annio, periodo, idCentro, 0, _conexionConta).catch(err => {
                    return reject(err.message || err);
                });

                // calculo la conciliacion
                this._calculaConciliacion(idCentro, annio, periodo).then(res => {
                    resolve(res);
                });
            });
        } catch (err) {
            Promise.reject(err.message || err);
        }
    }

    private async _importarDatosUH(idCentro: number, periodo: number, conexionRodas: ContaConexionesEntity): Promise<void> {
        const mbConnection = await this._contaConexionesSvc.conexionRodas(conexionRodas);

        return new Promise<void>(async (resolve, reject) => {
            // chequeo si el periodo es correcto
            await this._chequeaUltimoPeriodo(periodo, mbConnection).catch(err => {
                return Promise.reject(err.message || err);
            });

            // importo las Categorias
            await this._importarCategoriaUH(idCentro, mbConnection).catch(err => {
                return reject(err.message || err);
            });

            // importo los MB
            await this._importarUH(idCentro, periodo, mbConnection).catch(err => {
                return reject(err.message || err);
            });

            resolve();
        });
    }

    private async _importarCategoriaUH(idCentro: number, conexionRodas: DataSource): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            conexionRodas
                .query(queryUhCategorias)
                .then(async res => {
                    if (res.length) {
                        const _categoria = this._xmlSvc.jsonToXML('Categoria', res);

                        await this.dataSource
                            .query(`EXEC dbo.pUH_ImportCategoriaXML @0, @1`, [_categoria, idCentro])
                            .then(() => {
                                resolve();
                            })
                            .catch(err => {
                                reject(err.message || err);
                            });
                    }
                })
                .catch((err: Error) => {
                    reject(err.message || err);
                });
        });
    }

    private async _chequeaUltimoPeriodo(periodo: number, conexionRodas: DataSource): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            conexionRodas
                .query(queryUhUltimoPeriodo)
                .then(per => {
                    const periodoActual = toNumber(per[0].Periodo) + 1;
                    if (periodoActual !== 0 && periodo > periodoActual) {
                        return reject('No existen datos de los Útiles y Herramientas para el período que está analizando. Seleccione un período anterior.');
                    }
                    resolve(periodoActual);
                })
                .catch((err: Error) => {
                    reject(err.message || err);
                });
        });
    }

    private async _importarUH(idCentro: number, periodo: number, conexionRodas: DataSource): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            // leo primero de la tabla MB_Periodo
            const ultimoPeriodoResp = await this.dataSource
                .query(querySiscoUltimoPeriodoUH.replace(/@Centro/gi, idCentro.toString()))
                .then(async per => {
                    return per;
                })
                .catch(err => reject(err));

            let periodoActual = toNumber(ultimoPeriodoResp[0].Periodo);
            if (periodoActual > periodo) periodoActual = periodo;

            for (let per = periodoActual; per <= periodo; per++) {
                let _uh: string;
                let _query = await conexionRodas
                    .query(queryUhHistorial.replace(/@Centro/gi, idCentro.toString()).replace(/@Periodo/gi, per.toString()))
                    .then(res => {
                        if (res.length) {
                            _uh = this._xmlSvc.jsonToXML('UH', res);
                        }
                        return _uh;
                    })
                    .catch((err: Error) => {
                        return reject(err.message || err);
                    });
                if (!_query) {
                    _query = await conexionRodas
                        .query(queryUh.replace(/@Centro/gi, idCentro.toString()).replace(/@Periodo/gi, per.toString()))
                        .then(res => {
                            if (res.length) {
                                _uh = this._xmlSvc.jsonToXML('UH', res);
                            }
                            return _uh;
                        })
                        .catch((err: Error) => {
                            return reject(err.message || err);
                        });
                }
                if (_query) {
                    // inserto los MB
                    await this.dataSource
                        .query(`EXEC dbo.pUH_ImportUtilesXML @0, @1, @2`, [_query, idCentro, per])
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

    private _calculaConciliacion(idCentro: number, annio: number, periodo: number): Promise<ConciliaUH[]> {
        return new Promise<ConciliaUH[]>((resolve, reject) => {
            this.dataSource
                .query(`EXEC pUH_CalculaConciliacion @0, @1, @2`, [idCentro, annio, periodo])
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err.message || err);
                });
        });
    }
}
