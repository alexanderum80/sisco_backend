import { toNumber, cloneDeep } from 'lodash';
import { Usuarios } from './../usuarios/usuarios.entity';
import { ETipoClasificadorCuenta } from './../clasificador-cuenta/clasificador-cuenta.model';
import { ClasificadorCuentaService } from './../clasificador-cuenta/clasificador-cuenta.service';
import { XmlJsService } from './../shared/services/xml-js/xml-js.service';
import { UnidadesService } from './../unidades/unidades.service';
import { ContaConexionesService } from './../conta-conexiones/conta-conexiones.service';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { Injectable } from '@nestjs/common';
import {
    queryUltimoPeriodo,
    queryComprobantesRodas,
    queryAsientoRodas,
    queryMayorRodas,
    queryRangoAsientosMesRodas,
    querySaldosAcumuladosRodas,
    ConciliaContaInput,
    queryClasificadorCuentasRodas,
    ConciliaContabilidadQueryResponse,
    queryReporteConsultas,
    ConciliaContaQueryResponse,
    queryReporteExpresiones,
    queryReporteValores,
    IniciarSaldosInput,
    ChequearCentrosInput,
    queryInsertClasificadorUnidad,
    querySwitchAuditRodas,
} from './concilia-conta.model';
import { InjectConnection } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ConciliaContaService {
    constructor(
        @InjectConnection() private readonly connection: DataSource,
        private _contaConexionesService: ContaConexionesService,
        private _unidadesService: UnidadesService,
        private _xmlJsService: XmlJsService,
        private _clasificadorCuentaSvc: ClasificadorCuentaService,
    ) {}

    async conciliaContabilidad(user: Usuarios, conciliaContaInput: ConciliaContaInput): Promise<ConciliaContabilidadQueryResponse> {
        try {
            const { IdDivision } = user;
            const { idCentro, periodo, annio, tipoCentro, tipoEntidad } = conciliaContaInput;
            const consolidado = tipoCentro === 2 ? '1' : '0';

            // verificar si se ha definido la conexión al Rodas
            const _conexionRodasQuery = await this._contaConexionesService.findByIdUnidad(idCentro, tipoCentro === 2);

            const _conexionConta = _conexionRodasQuery.data;
            _conexionConta.BaseDatos = _conexionConta.BaseDatos.substring(0, _conexionConta.BaseDatos.length - 4) + annio.toString();

            // conecto al Conta del Centro
            const _contaConexionCentro: DataSource = await this._contaConexionesService.conexionRodas(_conexionConta);

            // importar y chequear el clasificador de cuentas
            const _chequeaClasifRes = await this._importarClasificador(idCentro, tipoCentro, annio, consolidado, periodo, _contaConexionCentro);
            if (_chequeaClasifRes.data.length) {
                return {
                    success: false,
                    data: {
                        ReporteClasificador: {
                            success: false,
                            data: JSON.stringify(_chequeaClasifRes.data),
                        },
                        ReporteConsultas: {
                            success: true,
                        },
                        ReporteExpresiones: {
                            success: true,
                        },
                        ReporteValores: {
                            success: true,
                        },
                    },
                    error: 'Usted tiene errores en el Clasificador, lo que conlleva a que no pueda terminar el análisis, ni entregar el balance a nivel superior. Vaya a la pestaña Análisis del Clasificador y Corrija estos errores.',
                };
            }

            // importar los comprobantes, asientos, etc.
            await this.importarContabilidad(idCentro, annio, periodo, consolidado, _contaConexionCentro);

            // cierro la conexión al Rodas del Centro
            if (_contaConexionCentro && _contaConexionCentro.isInitialized) _contaConexionCentro.destroy();

            // calcular la conciliación
            let _error = '';
            await this._calculaConciliacion(idCentro, tipoCentro, annio, periodo, tipoEntidad, IdDivision).catch(err => {
                _error = err.message;
            });

            // devuelvo el resultado de la conciliación
            return new Promise<ConciliaContabilidadQueryResponse>(resolve => {
                this._getReportesConciliacion(idCentro, consolidado, periodo, IdDivision)
                    .then(result => {
                        if (_error) {
                            result.success = false;
                            result.error = _error;
                        }

                        resolve(result);
                    })
                    .catch(err => {
                        throw new Error(err);
                    });
            });
        } catch (err: any) {
            return {
                success: false,
                data: {
                    ReporteClasificador: {
                        success: true,
                        data: JSON.stringify(''),
                    },
                    ReporteConsultas: {
                        success: true,
                    },
                    ReporteExpresiones: {
                        success: true,
                    },
                    ReporteValores: {
                        success: true,
                    },
                },
                error: err.message ? err.message : err,
            };
        }
    }

    async _importarClasificador(idUnidad: number, tipoCentro: number, annio: number, cons: string, periodo: number, contaConexion: DataSource): Promise<any> {
        try {
            // inserto el clasificador del Rodas
            const _queryClasifCuentasRes = await contaConexion.query(queryClasificadorCuentasRodas).catch(err => {
                throw new Error(err.message ? err.message : err);
            });

            let _clasifCuentasXML = this._xmlJsService.jsonToXML('Clasificador_de_Cuentas', {});

            if (_queryClasifCuentasRes.length) {
                _clasifCuentasXML = this._xmlJsService.jsonToXML('Clasificador_de_Cuentas', _queryClasifCuentasRes);
            }

            let tipoClasif = '';
            switch (tipoCentro) {
                case 0:
                    tipoClasif = '2';
                    break;
                case 1:
                    tipoClasif = '3';
                    break;
                case 2:
                    tipoClasif = '1';
                    break;
            }

            return new Promise<any>(resolve => {
                this.connection
                    .query(`EXEC dbo.pConta_ImportClasifCuentaXML @0, @1, @2, @3, @4, @5`, [_clasifCuentasXML, idUnidad, tipoClasif, cons, annio, periodo])
                    .then(result => {
                        resolve({ data: result });
                    })
                    .catch(err => {
                        throw new Error(err.message ? err.message : err);
                    });
            });
        } catch (err: any) {
            if (contaConexion && contaConexion.isInitialized) contaConexion.destroy();

            throw new Error(err.message ? err.message : err);
        }
    }

    async importarContabilidad(idUnidad: number, annio: number, periodo: number, cons: string, contaConexion: DataSource): Promise<void> {
        try {
            // obtener el ultimo periodo importado en el SISCO
            const _queryUltimoPeriodo = queryUltimoPeriodo
                .replace(/@Anio/g, annio.toString())
                .replace(/@Cons/g, cons.toString())
                .replace(/@Centro/g, idUnidad.toString());
            const _ultimoPeriodoRes = await this.connection.query(_queryUltimoPeriodo).then(result => {
                return result;
            });

            let _ultimoPeriodo = -1;
            if (_ultimoPeriodoRes.length) {
                _ultimoPeriodo = toNumber(_ultimoPeriodoRes[0].Periodo);
            }

            // chequear los datos adulterados
            await this._chequeaDatosAdulterados(idUnidad, contaConexion);

            // chequear saldos acumulados hasta el periodo anterior
            await this._chequearSaldoAcumulados(idUnidad, annio, _ultimoPeriodo, cons, contaConexion);

            const _periodoInicial = _ultimoPeriodo < periodo ? _ultimoPeriodo : periodo;

            for (let per = _periodoInicial; per <= periodo; per++) {
                // importar los comprobantes
                await this._importarComprobantes(idUnidad, annio, per, cons, contaConexion);

                // importar los asientos
                await this._importarAsientos(idUnidad, annio, per, cons, contaConexion);

                // importar mayor
                await this._importarMayor(idUnidad, annio, periodo, cons, contaConexion);
            }
        } catch (err: any) {
            if (contaConexion && contaConexion.isInitialized) contaConexion.destroy();

            throw new Error(err.message ? err.message : err);
        }
    }

    private async _chequeaDatosAdulterados(idUnidad: number, conexionRodas: DataSource): Promise<void> {
        const _queryAsientos = queryRangoAsientosMesRodas;

        const _unidadRes = await this._unidadesService.getUnidadById(idUnidad);
        if (!_unidadRes.success) {
            throw new Error(_unidadRes.error.toString());
        }
        // const _unidadInfo = _unidadRes.data;

        await conexionRodas
            .query(_queryAsientos)
            .then(result => {
                let _asientoAnt = 0;
                let _asientoIni = 0;

                result.forEach((asiento: any) => {
                    _asientoIni = toNumber(asiento.Ini);

                    if (_asientoIni < _asientoAnt) {
                        const _periodo = toNumber(asiento.Período) - 1;
                        // const _unidad = _unidadInfo.IdUnidad + '-' + _unidadInfo.Nombre;
                        // const _division = _unidadInfo.IdDivision + '-' + _unidadInfo.Division;

                        // let _msg = '';
                        let _error;

                        if (_periodo < 0) {
                            // _msg = `Existe una(s) línea(s) en blanco en los Asientos del Centro ${ _unidad },
                            //     perteneciente a la División ${ _division }.`;
                            _error = `Existe una(s) línea(s) en blanco en los Asientos del Centro`;
                        } else {
                            // _msg = `Datos del Rodas adulterados en el período ${ _periodo } del Centro ${ _unidad },
                            //     pertenciente a la División ${ _division }.`;
                            _error = `Se adulteraron los datos del sistema Rodas.
                            Restaure los datos contables a partir del período ${_periodo}, reconstruya lo que le falta de este y trabaje en el período que le sigue, para después enviar la información al nivel superior.
                            La causa es uno o más comprobantes hechos en el período ${_periodo} después de haber trabajado el período ${_periodo + 1}`;
                        }

                        // enviar correo

                        throw new Error(_error);
                    }

                    _asientoAnt = toNumber(asiento.Fin);
                });
            })
            .catch(err => {
                throw new Error(err.message ? err.message : err);
            });
    }

    private async _chequearSaldoAcumulados(idUnidad: number, annio: number, periodo: number, cons: string, conexionRodas: DataSource): Promise<void> {
        const _querySaldosAcumRodas = querySaldosAcumuladosRodas.replace(/@Periodo/g, periodo.toString());

        const _querySaldoAcumRodasRes = await conexionRodas
            .query(_querySaldosAcumRodas)
            .then(result => {
                return { data: result };
            })
            .catch(err => {
                throw new Error(err.message ? err.message : err);
            });

        let _saldoDebito = 0;
        let _saldoCredito = 0;
        if (_querySaldoAcumRodasRes.data.length > 0) {
            _saldoDebito = _querySaldoAcumRodasRes.data[0].Debito;
            _saldoCredito = _querySaldoAcumRodasRes.data[0].Credito;
        }

        await this.connection
            .query('EXEC dbo.pConta_SaldoAcumulado @0, @1, @2, @3, @4, @5', [idUnidad, cons, annio, periodo, _saldoDebito, _saldoCredito])
            .then(result => {
                if (result[0].DifDebito !== 0 || result[0].DifCredito !== 0) {
                    const _error = `Los Saldos Acumulados entre el Rodas y SISCO hasta el período ${periodo - 1} no coinciden.
                    Concilie el período anterior, y después concilie el actual.\n\nNo se continuará con la Conciliación.`;

                    throw new Error(_error);
                }
            })
            .catch(err => {
                throw new Error(err.message ? err.message : err);
            });
    }

    private async _importarComprobantes(idUnidad: number, annio: number, periodo: number, cons: string, rodasConexion: DataSource): Promise<void> {
        const _queryComprobantes = queryComprobantesRodas.replace(/@Periodo/g, periodo.toString());
        const _queryCompRes = await rodasConexion
            .query(_queryComprobantes)
            .then(result => {
                return result;
            })
            .catch(err => {
                throw new Error(err.message ? err.message : err);
            });

        if (_queryCompRes.length) {
            const _comprobantes = this._xmlJsService.jsonToXML('Comprobantes', _queryCompRes);

            await this.connection.query(`EXEC dbo.pConta_ImportComprobanteXML @0, @1, @2, @3, @4`, [_comprobantes, idUnidad, cons, annio, periodo]).catch(err => {
                throw new Error(err.message ? err.message : err);
            });
        }
    }

    private async _importarAsientos(idUnidad: number, annio: number, periodo: number, cons: string, rodasConexion: DataSource): Promise<void> {
        const _queryAsientos = queryAsientoRodas.replace(/@Periodo/g, periodo.toString());

        const _queryAsientosRes = await rodasConexion
            .query(_queryAsientos)
            .then(result => {
                return result;
            })
            .catch(err => {
                throw new Error(err.message ? err.message : err);
            });

        if (_queryAsientosRes.length) {
            const _asientos = this._xmlJsService.jsonToXML('Asiento', _queryAsientosRes);

            await this.connection.query(`EXEC dbo.pConta_ImportAsientoXML @0, @1, @2, @3, @4`, [_asientos, idUnidad, cons, annio, periodo]).catch(err => {
                throw new Error(err.message ? err.message : err);
            });
        }
    }

    private async _importarMayor(idUnidad: number, annio: number, periodo: number, cons: string, rodasConexion: DataSource): Promise<void> {
        const _queryMayor = queryMayorRodas.replace(/@Periodo/g, periodo.toString());
        const _queryMayorRes = await rodasConexion
            .query(_queryMayor)
            .then(result => {
                return result;
            })
            .catch(err => {
                throw new Error(err.message ? err.message : err);
            });

        if (_queryMayorRes.length) {
            const _mayor = this._xmlJsService.jsonToXML('Mayor', _queryMayorRes);

            await this.connection.query(`EXEC dbo.pConta_ImportMayorXML @0, @1, @2, @3, @4`, [_mayor, idUnidad, cons, annio, periodo]).catch(err => {
                throw new Error(err.message ? err.message : err);
            });
        }
    }

    private async _calculaConciliacion(idUnidad: number, tipoClasificador: number, anio: number, periodo: number, tipoEntidad: number, idDivision: number): Promise<void> {
        let cons = '0';

        switch (tipoClasificador) {
            case 0:
                tipoClasificador = 2;
                break;
            case 1:
                tipoClasificador = 3;
                break;
            case 2:
                cons = '1';
                tipoClasificador = 1;
                tipoEntidad = 1;
                break;
        }

        await this.connection
            .query(`EXEC dbo.pConta_CalculaConciliacion @0, @1, @2, @3, @4, @5, @6`, [idUnidad, tipoClasificador, tipoEntidad, cons, anio, periodo, idDivision])
            .catch(err => {
                throw new Error(err.message ? err.message : err);
            });
    }

    private async _getReportesConciliacion(idCentro: number, consolidado: string, periodo: number, idDivision: number): Promise<ConciliaContabilidadQueryResponse> {
        // devuelvo el resultado de la conciliación
        const _queryReporteConsultas = this._reporteConsultas(idCentro, consolidado, periodo, 1);
        const _queryReporteExpresiones = this._reporteExpresiones(idCentro, consolidado, periodo);
        const _queryReporteValores = this._reporteValores(idCentro, consolidado, periodo, idDivision);

        return new Promise<ConciliaContabilidadQueryResponse>(resolve => {
            Promise.all([_queryReporteConsultas, _queryReporteExpresiones, _queryReporteValores])
                .then(result => {
                    resolve({
                        success: true,
                        data: {
                            ReporteClasificador: {
                                success: true,
                                data: JSON.stringify(''),
                            },
                            ReporteConsultas: {
                                success: true,
                                data: result[0].data,
                            },
                            ReporteExpresiones: {
                                success: true,
                                data: result[1].data,
                            },
                            ReporteValores: {
                                success: true,
                                data: result[2].data,
                            },
                        },
                    });
                })
                .catch(err => {
                    throw new Error(err);
                });
        });
    }

    private async _reporteConsultas(idUnidad: number, cons: string, periodo: number, idConsulta: number): Promise<ConciliaContaQueryResponse> {
        const _query = queryReporteConsultas
            .replace(/@Centro/g, idUnidad.toString())
            .replace(/@Consolidado/g, cons)
            .replace(/@Periodo/g, periodo.toString())
            .replace(/@IdConsulta/g, idConsulta.toString());

        return new Promise<ConciliaContaQueryResponse>(resolve => {
            this.connection
                .query(_query)
                .then(result => {
                    resolve({
                        success: true,
                        data: JSON.stringify(result),
                    });
                })
                .catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
        });
    }

    private async _reporteExpresiones(idUnidad: number, cons: string, periodo: number): Promise<ConciliaContaQueryResponse> {
        const _query = queryReporteExpresiones
            .replace(/@Centro/g, idUnidad.toString())
            .replace(/@Consolidado/g, cons)
            .replace(/@Periodo/g, periodo.toString());

        return new Promise<ConciliaContaQueryResponse>(resolve => {
            this.connection
                .query(_query)
                .then(result => {
                    resolve({
                        success: true,
                        data: JSON.stringify(result),
                    });
                })
                .catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
        });
    }

    private async _reporteValores(idUnidad: number, cons: string, periodo: number, idDivision: number): Promise<ConciliaContaQueryResponse> {
        const _query = queryReporteValores
            .replace(/@Centro/g, idUnidad.toString())
            .replace(/@Consolidado/g, cons)
            .replace(/@Periodo/g, periodo.toString())
            .replace(/@IdDivision/g, idDivision.toString());

        return new Promise<ConciliaContaQueryResponse>(resolve => {
            this.connection
                .query(_query)
                .then(result => {
                    resolve({
                        success: true,
                        data: JSON.stringify(result),
                    });
                })
                .catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
        });
    }

    async iniciarSaldos(iniciarSaldosInput: IniciarSaldosInput): Promise<MutationResponse> {
        try {
            const { idCentro, consolidado, annio } = iniciarSaldosInput;

            return new Promise<MutationResponse>(resolve => {
                this.connection
                    .query(`EXEC dbo.pConta_InicializarDatos @0, @1, @2`, [idCentro, consolidado, annio])
                    .then(() => {
                        resolve({ success: true });
                    })
                    .catch(err => {
                        return { success: false, error: err.message ? err.message : err };
                    });
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async arreglaClasificadorCuenta(idUnidad: number, tipoUnidad: string, annio: string): Promise<MutationResponse> {
        try {
            // verificar si se ha definido la conexión al Rodas
            const _conexionRodasQuery = await this._contaConexionesService.findByIdUnidad(idUnidad, tipoUnidad === '2');
            const _conexionConta = _conexionRodasQuery.data;
            _conexionConta.BaseDatos = _conexionConta.BaseDatos.substring(0, _conexionConta.BaseDatos.length - 4) + annio.toString();

            const _conexionCodif = cloneDeep(_conexionConta);
            _conexionCodif.BaseDatos = _conexionCodif.BaseDatos.substring(0, _conexionCodif.BaseDatos.length - 4).replace(/Conta/gi, 'Codif');

            let tipoClasificador = 0;

            switch (tipoUnidad) {
                case '0':
                    tipoClasificador = ETipoClasificadorCuenta.Centro;
                    break;
                case '1':
                    tipoClasificador = ETipoClasificadorCuenta.Complejo;
                    break;
                case '2':
                    tipoClasificador = ETipoClasificadorCuenta.Consolidado;
                    break;
            }

            const _clasifCuentasRealQuery = await this._clasificadorCuentaSvc.getClasificadorCuentaByTipo(tipoClasificador);
            if (!_clasifCuentasRealQuery.success) {
                throw new Error(_clasifCuentasRealQuery.error);
            }

            const _clasifCuentasReal = _clasifCuentasRealQuery.data;

            const bdCodif = await this._contaConexionesService.conexionRodas(_conexionCodif);
            const bdConta = await this._contaConexionesService.conexionRodas(_conexionConta);
            // const _clasifCuentaUC = await bdConta.query('SELECT * FROM dbo.[Clasificador de Cuentas]').then(result => {
            //     return result;
            // }).catch(err => {
            //     return { success: false, error: err.message ? err.message : err };
            // });

            // deshabilito el Audit
            const _queryStopAudit = querySwitchAuditRodas.replace(/@DataBase/g, bdConta.options.database.toString()).replace(/@Accion/g, 'OFF');

            await bdCodif.query(_queryStopAudit).catch(err => {
                return { success: false, error: err.message ? err.message : err };
            });

            _clasifCuentasReal.forEach(
                async (element: {
                    Cuenta: string;
                    SubCuenta: string;
                    Descripcion: string;
                    Naturaleza: string;
                    Terminal: boolean;
                    Crit1: string;
                    Crit2: string;
                    Crit3: string;
                    Obligacion: boolean;
                    Crit1Consolidacion: string;
                    Crit2Consolidacion: string;
                    Crit3Consolidacion: string;
                }) => {
                    // inserto la cuenta, si no existe
                    const _queryInsert = queryInsertClasificadorUnidad
                        .replace(/@Anio/g, annio)
                        .replace(/@Cta/g, element.Cuenta)
                        .replace(/@SubCta/g, element.SubCuenta)
                        .replace(/@Desc/g, element.Descripcion)
                        .replace(/@Nat/g, element.Naturaleza)
                        .replace(/@Subm/g, element.Terminal === true ? '1' : '0')
                        .replace(/@An1/g, element.Crit1)
                        .replace(/@An2/g, element.Crit2)
                        .replace(/@An3/g, element.Crit3)
                        .replace(/@Obl/g, element.Obligacion === true ? '1' : '0')
                        .replace(/@Term/g, element.Terminal === true ? '1' : '0')
                        .replace(/@ConsTipoAn1/g, element.Crit1Consolidacion)
                        .replace(/@ConsTipoAn2/g, element.Crit2Consolidacion)
                        .replace(/@ConsTipoAn3/g, element.Crit3Consolidacion)
                        .replace(/@CondCons/g, element.Terminal === true ? 'X' : '')
                        .replace(/@ConsAn1/g, element.Crit1Consolidacion === '@' ? idUnidad.toString() : '')
                        .replace(/@ConsAn2/g, element.Crit2Consolidacion === '@' ? idUnidad.toString() : '')
                        .replace(/@ConsAn3/g, element.Crit3Consolidacion === '@' ? idUnidad.toString() : '');

                    await bdCodif.query(_queryInsert).catch(err => {
                        // habilito el Audit
                        const _queryStopAudit = querySwitchAuditRodas.replace(/@DataBase/g, bdConta.options.database.toString()).replace(/@Accion/g, 'ON');

                        bdCodif.query(_queryStopAudit).catch(err => {
                            return { success: false, error: err.message ? err.message : err };
                        });

                        return { success: false, error: err.message ? err.message : err };
                    });

                    const _queryUpdate = queryInsertClasificadorUnidad
                        .replace(/@Anio/g, annio)
                        .replace(/@Cta/g, element.Cuenta)
                        .replace(/@SubCta/g, element.SubCuenta)
                        .replace(/@Desc/g, element.Descripcion)
                        .replace(/@Nat/g, element.Naturaleza)
                        .replace(/@Subm/g, element.Terminal === true ? '1' : '0')
                        .replace(/@An1/g, element.Crit1)
                        .replace(/@An2/g, element.Crit2)
                        .replace(/@An3/g, element.Crit3)
                        .replace(/@Obl/g, element.Obligacion === true ? '1' : '0')
                        .replace(/@Term/g, element.Terminal === true ? '1' : '0')
                        .replace(/@ConsTipoAn1/g, element.Crit1Consolidacion)
                        .replace(/@ConsTipoAn2/g, element.Crit2Consolidacion)
                        .replace(/@ConsTipoAn3/g, element.Crit3Consolidacion)
                        .replace(/@CondCons/g, element.Terminal === true ? 'X' : '')
                        .replace(/@ConsAn1/g, element.Crit1Consolidacion === '@' ? idUnidad.toString() : '')
                        .replace(/@ConsAn2/g, element.Crit2Consolidacion === '@' ? idUnidad.toString() : '')
                        .replace(/@ConsAn3/g, element.Crit3Consolidacion === '@' ? idUnidad.toString() : '');

                    await bdCodif.query(_queryUpdate).catch(err => {
                        // habilito el Audit
                        const _queryStopAudit = querySwitchAuditRodas.replace(/@DataBase/g, bdConta.options.database.toString()).replace(/@Accion/g, 'ON');

                        bdCodif.query(_queryStopAudit).catch(err => {
                            return { success: false, error: err.message ? err.message : err };
                        });

                        return { success: false, error: err.message ? err.message : err };
                    });
                },
            );

            return new Promise<MutationResponse>(resolve => {
                resolve({ success: true });
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async chequearCentro(chequearCentrosInput: ChequearCentrosInput): Promise<ConciliaContaQueryResponse> {
        try {
            const { idCentro, annio, periodo, centrosAChequear } = chequearCentrosInput;

            const cons = idCentro === 100 ? 1 : 0;

            for (let index = 0; index < centrosAChequear.length; index++) {
                const centroChe = centrosAChequear[index];

                await this.connection.query(`EXEC dbo.InsertChequeoCentroVsConsolidado @0, @1, @2, @3, @4`, [idCentro, cons, annio, periodo, centroChe]).catch(err => {
                    throw new Error(err.message ? err.message : err);
                });
            }

            return new Promise<ConciliaContaQueryResponse>(resolve => {
                this.connection
                    .query(`EXEC dbo.p_ChequeoCentro @0`, [`Centro = ${idCentro} AND Periodo = ${periodo} AND Unidad IN (${centrosAChequear.join(', ')})`])
                    .then(result => {
                        resolve({ success: true, data: JSON.stringify(result) });
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
