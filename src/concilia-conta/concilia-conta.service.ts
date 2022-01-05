import { ETipoClasificadorCuenta } from './../clasificador-cuenta/clasificador-cuenta.model';
import { ClasificadorCuentaService } from './../clasificador-cuenta/clasificador-cuenta.service';
import { XmlJsService } from './../shared/services/xml-js/xml-js.service';
import { UnidadesService } from './../unidades/unidades.service';
import { RodasVentasService } from './../rodas-ventas/rodas-ventas.service';
import { RodasInventarioService } from 'src/rodas-inventario/rodas-inventario.service';
import { RodasVentas } from './../rodas-ventas/rodas-ventas.entity';
import { RodasInventario } from './../rodas-inventario/rodas-inventario.entity';
import { toNumber, cloneDeep } from 'lodash';
import { ContaConexionesService } from './../conta-conexiones/conta-conexiones.service';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { ContaConexiones } from './../conta-conexiones/conta-conexiones.entity';
import { Injectable } from '@nestjs/common';
import { queryUltimoPeriodo, queryInventarioRodas, queryVentasRodas, queryInventarioRodasCons, queryVentasRodasCons, queryComprobantesRodas, queryAsientoRodas, queryMayorRodas, queryRangoAsientosMes, querySaldosAcumuladosRodas, ConciliaContaInput, queryClasificadorCuentas, queryConsultaReporteClasificador, ConciliaContabilidadQueryResponse, queryReporteConsultas, ConciliaContaQueryResponse, queryReporteExpresiones, queryReporteValores, IniciarSaldosInput } from './concilia-conta.model';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class ConciliaContaService {
    constructor(
        @InjectConnection() private readonly connection: Connection,
        private _contaConexionesService: ContaConexionesService,
        private _rodasInventarioService: RodasInventarioService,
        private _rodasVentasService: RodasVentasService,
        private _unidadesService: UnidadesService,
        private _xmlJsService: XmlJsService,
        private _clasificadorCuentaSvc: ClasificadorCuentaService
    ) {}

    async conciliaContabilidad(conciliaContaInput: ConciliaContaInput): Promise<ConciliaContabilidadQueryResponse> {
        try {
            const { idCentro, periodo, annio, tipoCentro, tipoEntidad } = conciliaContaInput;
            const consolidado = tipoCentro === 2 ? '1' : '0';

            // verificar si se ha definido la conexión al Rodas
            const _conexionRodasQuery = await this._contaConexionesService.getConexionByIdUnidad(idCentro, tipoCentro === 2);
            // if (!_conexionRodasQuery.success) {
            //     throw new Error(_conexionRodasQuery.error + ' No se pudo obtener la Conexión al Rodas del Centro ' + idCentro);
            // }
            const _conexionConta = _conexionRodasQuery.data;
            _conexionConta.BaseDatos = _conexionConta.BaseDatos.substring(0, _conexionConta.BaseDatos.length - 4) + annio.toString();

            const _conexionCodif = cloneDeep(_conexionConta);
            _conexionCodif.BaseDatos = _conexionCodif.BaseDatos.substring(0, _conexionCodif.BaseDatos.length - 4).replace(/Conta/gi, 'Codif');

            // borrar datos de los reportes
            await this._borrarReportes(idCentro, consolidado, periodo);
            // if (!_queryBorrarReportes.success) {
            //     throw new Error(_queryBorrarReportes.error.toString());
            // }

            // importar el clasificador de cuentas
            await this._importarClasificador(idCentro, annio, consolidado, _conexionCodif);
            // if (!_importarClasifCuentasRes.success) {
            //     throw new Error(_importarClasifCuentasRes.error.toString());
            // }

            // chequea clasificador
            const _chequeaClasifRes = await this._chequearClasificador(idCentro, tipoCentro, annio);
            if (_chequeaClasifRes.data.length) {
                return ({
                    success: false,
                    data: {
                        ReporteClasificador: {
                            success: false, data: JSON.stringify(_chequeaClasifRes.data)
                        },
                        ReporteConsultas: {
                            success: true
                        },
                        ReporteExpresiones: {
                            success: true
                        },
                        ReporteValores: {
                            success: true
                        }
                    },
                    error: 'Usted tiene errores en el Clasificador, lo que conlleva a que no pueda terminar el análisis, ni entregar el balance a nivel superior. Vaya a la pestaña Análisis del Clasificador y Corrija estos errores.'
                });
            }

            // importar los comprobantes, asientos, etc.
            await this.importarContabilidad(idCentro, annio, periodo, consolidado, _conexionConta);
            // if (!_importarAsientosRes.success) {
            //     throw new Error(_importarAsientosRes.error.toString());
            // }

            // calcular la conciliación
            await this._calculaConciliacion(idCentro, tipoCentro, annio, periodo, tipoEntidad);
            // if (!_calculaConciliacionRes.success) {
            //     throw new Error(_calculaConciliacionRes.error.toString());
            // }

            // validando información
            if (tipoCentro === 2 && idCentro !== 100) {
                await this._centrosNoConciliados(annio, periodo, idCentro);
                // if (!_queryCentrosNoConciliados.success) {
                //     throw new Error(_queryCentrosNoConciliados.error.toString());
                // }

                await this._centrosNoChequeadosVsConsolidado(annio, periodo, idCentro);
                // if (!_queryCentrosNoChequeados.success) {
                //     throw new Error(_queryCentrosNoChequeados.error.toString());
                // }

                await this._centrosDiferenciasVsConsolidado(idCentro, periodo);
                // if (!_queryCentrosDiferenciasVsCons.success) {
                //     throw new Error(_queryCentrosDiferenciasVsCons.error.toString());
                // }
            }

            // devuelvo el resultado de la conciliación
            const _queryReporteConsultas = this._reporteConsultas(idCentro, consolidado, periodo, 1);
            const _queryReporteExpresiones = this._reporteExpresiones(idCentro, consolidado, periodo);
            const _queryReporteValores = this._reporteValores(idCentro, consolidado, periodo);

            return new Promise<ConciliaContabilidadQueryResponse>((resolve, reject) => {
                Promise.all([_queryReporteConsultas, _queryReporteExpresiones, _queryReporteValores]).then(result => {
                    resolve({
                        success: true,
                        data: {
                            ReporteClasificador: {
                                success: true,
                                data: JSON.stringify('')
                            },
                            ReporteConsultas: {
                                success: true,
                                data: result[0].data
                            },
                            ReporteExpresiones: {
                                success: true,
                                data: result[1].data
                            },
                            ReporteValores: {
                                success: true,
                                data: result[2].data
                            }
                        }
                    });
                }).catch(err => {
                    throw new Error(err);
                });
            });
        } catch (err) {
            return {
                success: false,
                data: {
                    ReporteClasificador: {
                        success: true, data: JSON.stringify('')
                    },
                    ReporteConsultas: {
                        success: true
                    },
                    ReporteExpresiones: {
                        success: true
                    },
                    ReporteValores: {
                        success: true
                    }
                },
                error: err.message ? err.message : err };
        }
    }

    private async _borrarReportes(idUnidad: number, cons: string, periodo: number): Promise<void> {
        // try {
            const _queryDeleteCentrosAConsolidar = `DELETE dbo.Conta_CentrosAConsolidar
                WHERE (Centro = ${ idUnidad }) AND (Periodo = ${ periodo })`;
            const _queryDeleteReporteChequeoCentro = `DELETE dbo.Conta_ReporteChequeoCentro
                WHERE (Centro = ${ idUnidad }) AND (Periodo >= ${ periodo })`;
            const _queryDeleteReporteClasificador = `DELETE dbo.Conta_ReporteClasificador
                WHERE (Centro = ${ idUnidad }) AND (Consolidado = ${ cons })`;
            const _queryDeleteReporteConsultas = `DELETE dbo.Conta_ReporteConsultas
                WHERE (Centro = ${ idUnidad }) AND (Consolidado = ${ cons }) AND (Periodo = ${ periodo }) and IdConsulta = 1`;
            const _queryDeleteReporteExpresiones = `DELETE dbo.Conta_ReporteExpersiones
                WHERE (Centro = ${ idUnidad }) AND (Consolidado = ${ cons }) AND (Periodo = ${ periodo })`;
            const _queryDeleteReporteValor = `DELETE dbo.Conta_ReporteValor
                WHERE (Centro = ${ idUnidad }) AND (Consolidado = ${ cons }) AND (Periodo = ${ periodo })`;
            // const _queryDeleteReporteEncabezado = `DELETE dbo.Conta_ReporteEncabezado
            //     WHERE (IdCentro = ${ idUnidad }) AND (Consolidado = ${ tipoCentro })`;

            const _querysDelete = [
                _queryDeleteCentrosAConsolidar,
                _queryDeleteReporteChequeoCentro,
                _queryDeleteReporteClasificador,
                _queryDeleteReporteConsultas,
                _queryDeleteReporteExpresiones,
                _queryDeleteReporteValor,
                // _queryDeleteReporteEncabezado
            ];
            for (let i = 0; i < _querysDelete.length; i++) {
                const _query = _querysDelete[i];

                await this.connection.query(_query).catch(err => {
                    throw new Error(err.message ? err.message : err);
                });
            }
        // } catch (err) {
        //     return { success: false, error: err.message ? err.message : err };
        // }
    }

    async _importarClasificador(idUnidad: number, annio: number, cons: string, codifConexion: ContaConexiones): Promise<void> {
        let _codifConexionCentro: Connection;

        try {
            // borro el clasificador existente en el SISCO
            const _queryDeleteClasif = `DELETE FROM Clasificador_de_Cuentas
            WHERE (Centro = ${ idUnidad }) AND (Consolidado = ${ cons }) AND (Año = ${ annio })`;

            await this.connection.query(_queryDeleteClasif).catch(err => {
                throw new Error(err.message ? err.message : err);
            });

            // inserto el clasificador del Rodas
            _codifConexionCentro = await (await this._contaConexionesService.conexionRodas(codifConexion)).connect();

            const _queryClasifCuentas = queryClasificadorCuentas.replace(/@Anio/g, annio.toString());
            const _queryClasifCuentasRes = await _codifConexionCentro.query(_queryClasifCuentas).catch(err => {
                throw new Error(err.message ? err.message : err);
            });

            if (_codifConexionCentro.isConnected)
                _codifConexionCentro.close();

            let _clasifCuentasArray = [];
            for (let i = 0; i < _queryClasifCuentasRes.length; i++) {
                const element = _queryClasifCuentasRes[i];
                _clasifCuentasArray.push({
                    Clasificador_de_Cuentas: element
                });
            }

            const _clasifCuentas = this._xmlJsService.jsonToXML(_clasifCuentasArray);

            if (_clasifCuentasArray.length) {
                await this.connection.query(`EXEC dbo.pConta_ImportClasifCuentaXML @0, @1, @2, @3`, [_clasifCuentas, idUnidad, cons, annio]).catch(err => {
                    throw new Error(err.message ? err.message : err);
                });
            }
        } catch (err) {
            if (_codifConexionCentro.isConnected)
                _codifConexionCentro.close();

            throw new Error(err.message ? err.message : err);
        }
    }

    private async _chequearClasificador(idUnidad: number, tipoCentro: number, annio: number): Promise<any> {
        // try {
        const cons = tipoCentro === 2 ? '1' : '0';

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
        await this.connection.query(`EXEC InsertDiferenciasClasificador @0, @1, @2, @3`, [idUnidad, tipoClasif, cons, annio]).catch(err => {
            throw new Error(err.message ? err.message : err);
        });

        const _queryChequeaClasifRodas = queryConsultaReporteClasificador.replace(/@Centro/g, idUnidad.toString()).replace(/@Consolidado/g, cons);

        return new Promise<any>(resolve => {
            this.connection.query(_queryChequeaClasifRodas).then(result => {
                resolve({ data: result });
            }).catch(err => {
                throw new Error(err.message ? err.message : err);
            });
        });

            // if (!_queryChequeaClasifRes.success) {
            //     throw new Error(_queryChequeaClasifRes.error);
            // }

            // return new Promise<any>(resolve => {
            //     if (_queryChequeaClasifRes.data) {
            //         resolve({
            //             success: false,
            //             data: _queryChequeaClasifRes.data,
            //             error: 'Usted tiene errores en el Clasificador, lo que conlleva a que no pueda terminar el análisis, ni entregar el balance a nivel superior. Vaya a la pestaña Análisis del Clasificador y Corrija estos errores.'
            //         });
            //     } else {
            //         resolve({ success: true });
            //     }
            // });
        // } catch (err) {
        //     return { success: false, error: err.message ? err.message : err };
        // }
    }

    async importarContabilidad(idUnidad: number, annio: number, periodo: number, cons: string, contaConexion: ContaConexiones): Promise<void> {
        let _contaConexionCentro: Connection;

        try {
            _contaConexionCentro = await (await this._contaConexionesService.conexionRodas(contaConexion)).connect();

            // obtener el ultimo periodo importado en el SISCO
            let _queryUltimoPeriodo = queryUltimoPeriodo.replace(/@Anio/g, annio.toString())
                                                        .replace(/@Cons/g, cons.toString())
                                                        .replace(/@Centro/g, contaConexion.IdUnidad.toString());
            const _ultimoPeriodoRes = await this.connection.query(_queryUltimoPeriodo).then(result => {
                return result;
            });

            let _ultimoPeriodo = -1;
            if (_ultimoPeriodoRes.length) {
                _ultimoPeriodo = toNumber(_ultimoPeriodoRes[0].Periodo);
            }

            // chequear los datos adulterados
            await this._chequeaDatosAdulterados(idUnidad, _contaConexionCentro);
            // if (!_datosAdulteradosRes.success) {
            //     throw new Error(_datosAdulteradosRes.error.toString());
            // }

            // chequear saldos acumulados hasta el periodo anterior
            await this._chequearSaldoAcumulados(idUnidad, annio, _ultimoPeriodo, cons, _contaConexionCentro);

            const _periodoInicial = _ultimoPeriodo < periodo ? _ultimoPeriodo : periodo;
            // borro los comprobantes y los asientos
            await this._borrarDatos(idUnidad, annio, cons, _periodoInicial);
            // if (!_borraCompAsientoRes.success) {
            //     throw new Error(_borraCompAsientoRes.error.toString());
            // }

            for (let per = _periodoInicial; per <= periodo; per++) {
                // importar los comprobantes
                await this._importarComprobantes(idUnidad, annio, per, cons, _contaConexionCentro);
                // if (!_importarCompRes.success) {
                //     throw new Error(_importarCompRes.error.toString());
                // }

                // importar los asientos
                await this._importarAsientos(idUnidad, annio, per, cons, _contaConexionCentro);
                // if (!_importarAsientoRes.success) {
                //     throw new Error(_importarAsientoRes.error.toString());
                // }
            }

            // importar mayor
            await this._importarMayor(idUnidad, annio, periodo, cons, _contaConexionCentro);
            // if (!_importarMayorRes.success) {
            //     throw new Error(_importarMayorRes.error.toString());
            // }

            if (_contaConexionCentro.isConnected)
                _contaConexionCentro.close();
        } catch (err) {
            if (_contaConexionCentro.isConnected)
                _contaConexionCentro.close();

            throw new Error(err.message ? err.message : err);
        }
    }

    private async _chequeaDatosAdulterados(idUnidad: number, conexionRodas: Connection): Promise<void> {
        // try {
            const _queryAsientos = queryRangoAsientosMes;

            const _unidadRes = await this._unidadesService.getUnidadById(idUnidad);
            if (!_unidadRes.success) {
                throw new Error(_unidadRes.error.toString());
            }
            const _unidadInfo = _unidadRes.data;

            await conexionRodas.query(_queryAsientos).then(result => {
                let _asientoAnt = 0;
                let _asientoIni = 0;

                result.forEach(asiento => {
                    _asientoIni = toNumber(asiento.Ini);

                    if (_asientoIni < _asientoAnt) {
                        const _periodo = toNumber(asiento.Período) - 1;
                        const _unidad = _unidadInfo.IdUnidad + '-' + _unidadInfo.Nombre;
                        const _division = _unidadInfo.IdDivision + '-' + _unidadInfo.Division;

                        let _msg;
                        let _error;

                        if (_periodo < 0) {
                            _msg = `Existe una(s) línea(s) en blanco en los Asientos del Centro ${ _unidad },
                                perteneciente a la División ${ _division }.`;
                            _error = `Existe una(s) línea(s) en blanco en los Asientos del Centro`;
                        } else {
                            _msg = `Datos del Rodas adulterados en el período ${ _periodo } del Centro ${ _unidad },
                                pertenciente a la División ${ _division }.`;
                            _error = `Se adulteraron los datos del sistema Rodas.
                                Restaure los datos contables a partir del período ${ _periodo }, reconstruya lo que le falta de este y trabaje en el período que le sigue, para después enviar la información al nivel superior.
                                La causa es uno o más comprobantes hechos en el período ${ _periodo } después de haber trabajado el período ${ _periodo + 1 }`;
                        }

                        // enviar correo


                        throw new Error(_error);
                    }

                    _asientoAnt = toNumber(asiento.Fin);
                });
            }).catch(err => {
                throw new Error(err.message ? err.message : err);
            });
        // } catch (err) {
        //     if (conexionRodas.isConnected)
        //         conexionRodas.close();

        //     throw new Error(err.message ? err.message : err);
        // }
    }

    private async _chequearSaldoAcumulados(idUnidad: number, annio: number, periodo: number, cons: string, conexionRodas: Connection): Promise<void> {
        // try {
            const _querySaldosAcumRodas = querySaldosAcumuladosRodas.replace(/@Periodo/g, periodo.toString());

            const _querySaldoAcumRodasRes = await conexionRodas.query(_querySaldosAcumRodas).then(result => {
                return { data: result };
            }).catch(err => {
                throw new Error(err.message ? err.message : err);
            });

            let _saldoDebito = 0;
            let _saldoCredito = 0;
            if (_querySaldoAcumRodasRes.data.length > 0) {
                _saldoDebito = _querySaldoAcumRodasRes.data[0].Debito;
                _saldoCredito = _querySaldoAcumRodasRes.data[0].Credito;
            }

            await this.connection.query('EXEC dbo.pConta_SaldoAcumulado @0, @1, @2, @3, @4, @5', [idUnidad, cons, annio, periodo, _saldoDebito, _saldoCredito]).then(result => {
                if (result[0].DifDebito !== 0 || result[0].DifCredito !== 0) {
                    const _error = `Los Saldos Acumulados entre el Rodas y SISCO hasta el período ${ periodo - 1 } no coinciden.
                        Concilie el período anterior, y después concilie el actual.\n\nNo se continuará con la Conciliación.`;

                    throw new Error(_error);
                }
            }).catch(err => {
                throw new Error(err.message ? err.message : err);
            });
        // } catch (err) {
        //     if (conexionRodas.isConnected)
        //         conexionRodas.close();

        //     throw new Error(err.message ? err.message : err);
        // }
    }

    private async _borrarDatos(idUnidad: number, annio: number, cons: string, periodo: number): Promise<void> {
        // try {
            const _queryDeleteComprobante = `DELETE FROM Conta_Comprobantes
                WHERE (Centro = ${ idUnidad }) AND (Consolidado = ${ cons }) AND (Año = ${ annio }) AND (Período >= ${ periodo })`;
            const _queryDeleteAsientos = `DELETE FROM Conta_Asiento
                WHERE (Centro = ${ idUnidad }) AND (Consolidado = ${ cons }) AND (Año = ${ annio }) AND (Período >= ${ periodo })`;
            const _queryDeleteMayor = `DELETE FROM Conta_Mayor
                WHERE (Centro = ${ idUnidad }) AND (Consolidado = ${ cons }) AND (Año = ${ annio })`;

            const _querysDelete = [
                _queryDeleteComprobante,
                _queryDeleteAsientos,
                _queryDeleteMayor
            ];
            for (let i = 0; i < _querysDelete.length; i++) {
                const _query = _querysDelete[i];

                await this.connection.query(_query).catch(err => {
                    throw new Error(err.message ? err.message : err);
                });
            }
        // } catch (err) {
        //     return { success: false, error: err.message ? err.message : err };
        // }
    }

    private async _importarComprobantes(idUnidad: number, annio: number, periodo: number, cons: string, rodasConexion: Connection): Promise<void> {
        // try {
            const _queryComprobantes = queryComprobantesRodas.replace(/@Periodo/g, periodo.toString());
            const _queryCompRes = await rodasConexion.query(_queryComprobantes).then(result => {
                return { data: result };
            }).catch(err => {
                throw new Error(err.message ? err.message : err);
            });

            let _comprobantesArray = [];
            for (let i = 0; i < _queryCompRes.data.length; i++) {
                const element = _queryCompRes.data[i];
                _comprobantesArray.push({
                    Comprobantes: element
                });
            }
            const _comprobantes = this._xmlJsService.jsonToXML(_comprobantesArray);

            if (_comprobantesArray.length) {
                await this.connection.query(`EXEC dbo.pConta_ImportComprobanteXML @0, @1, @2, @3`, [_comprobantes, idUnidad, cons, annio]).catch(err => {
                    throw new Error(err.message ? err.message : err);
                });
            }
        // } catch (err) {
        //     throw new Error(err.message ? err.message : err);
        // }
    }

    private async _importarAsientos(idUnidad: number, annio: number, periodo: number, cons: string, rodasConexion: Connection): Promise<void> {
        // try {
            const _queryAsientos = queryAsientoRodas.replace(/@Periodo/g, periodo.toString());
            const _queryAsientosRes = await rodasConexion.query(_queryAsientos).then(result => {
                return {data: result };
            }).catch(err => {
                throw new Error(err.message ? err.message : err);
            });

            let _asientosArray = [];
            for (let i = 0; i < _queryAsientosRes.data.length; i++) {
                const element = _queryAsientosRes.data[i];
                _asientosArray.push({
                    Asiento: element
                });
            }
            const _asientos = this._xmlJsService.jsonToXML(_asientosArray);

            if (_asientosArray.length) {
                await this.connection.query(`EXEC dbo.pConta_ImportAsientoXML @0, @1, @2, @3`, [_asientos, idUnidad, cons, annio]).catch(err => {
                    throw new Error(err.message ? err.message : err);
                });
            }
        // } catch (err) {
        //     return { success: false, error: err.message ? err.message : err };
        // }
    }

    private async _importarMayor(idUnidad: number, annio: number, periodo: number, cons: string, rodasConexion: Connection): Promise<void> {
        // try {
            const _queryMayor = queryMayorRodas.replace(/@Periodo/g, periodo.toString());
            const _queryMayorRes = await rodasConexion.query(_queryMayor).then(result => {
                return { data: result };
            }).catch(err => {
                throw new Error(err.message ? err.message : err);
            });

            let _mayorArray = [];
            for (let i = 0; i < _queryMayorRes.data.length; i++) {
                const element = _queryMayorRes.data[i];
                _mayorArray.push({
                    Mayor: element
                });
            }
            const _mayor = this._xmlJsService.jsonToXML(_mayorArray);

            if (_mayorArray.length) {
                await this.connection.query(`EXEC dbo.pConta_ImportMayorXML @0, @1, @2, @3`, [_mayor, idUnidad, cons, annio]).catch(err => {
                    throw new Error(err.message ? err.message : err);
                });
            }
        // } catch (err) {
        //     return { success: false, error: err.message ? err.message : err };
        // }
    }

    private async _calculaConciliacion(idUnidad: number, tipoClasificador: number, anio: number, periodo: number, tipoEntidad: number): Promise<void> {
        // try {
            let cla = '0';

            switch (tipoClasificador) {
                case 0:
                    tipoClasificador = 2;
                    break;
                case 1:
                    tipoClasificador = 3;
                    break;
                case 2:
                    cla = '1';
                    tipoClasificador = 1;
                    tipoEntidad = 1;
                    break;
            }

            const _queryInsertAnalisiAsiento = this.connection.query(`EXEC dbo.InsertAnalisisAsiento @0, @1, @2, @3, @4, @5`, [tipoClasificador, tipoEntidad, cla, anio, periodo, idUnidad]);
            const _queryChequeoExpresiones = this.connection.query(`EXEC dbo.InsertChequeoExpresiones @0, @1, @2, @3, @4`, [tipoClasificador, cla, anio, periodo, idUnidad]);
            // const _queryReporteEncabezado = this.connection.query(`INSERT INTO dbo.Conta_ReporteEncabezado(Consolidado, Periodo, Centro, TipoContabilidad, FechaActualizacionClasificador, Version, PeriodoAnterior, FechaImportacion, idcentro) SELECT " + Consolidado + ",  A.Periodo, A.Centro, A.TipoContabilidad, A.Fechaclasificador, A.Version,A.PeriodoAnterior, A.Fecha, A.IdCentro FROM
            //     (SELECT ${ periodo } / ${ anio } AS Periodo, (SELECT MIN(RTRIM(IdUnidad) + '-' + Nombre) FROM dbo.vCentros where IdUnidad = ${ idUnidad } ) AS Centro, ${ cons } AS TipoContabilidad, (SELECT FechaClasificador FROM dbo.Log) AS Fechaclasificador, RTRIM('" + AssemblyConta + "')  AS Version, '" + sPeriodo + "/" + this.dePeriodo.DateTime.Year.ToString() + "' AS PeriodoAnterior, getdate() AS Fecha, " + this.lkUnidad.EditValue.ToString() + " as IdCentro) AS A`);

            await Promise.all([_queryInsertAnalisiAsiento, _queryChequeoExpresiones]).catch(err => {
                throw new Error(err.message ? err.message : err);
            });
        // } catch (err) {
        //     return { success: false, error: err.message ? err.message : err };
        // }
    }

    private async _centrosNoConciliados(anio: number, periodo: number, idDivision: number): Promise<void> {
        // try {
            await this.connection.query(`EXEC p_CentrosNoConciliados @0, @1, @2`, [anio, periodo, idDivision]).then(res => {
                if (res.length) {
                    const _centros: any[] = [];
                    res.forEach(row => {
                        _centros.push(row.Unidad);
                    });

                    // enviar email ****

                    throw new Error(`Los siguientes Centros no han Conciliado la Contabilidad en el SISCO a nivel de División ${ idDivision }.
                        Centros: ${ _centros.join(', ')}`);
                }
            }).catch(err => {
                throw new Error(err.message ? err.message : err);
            });
        // } catch (err) {
        //     return { success: false, error: err.message ? err.message : err };
        // }
    }

    private async _centrosNoChequeadosVsConsolidado(anio: number, periodo: number, idDivision: number): Promise<void> {
        // try {
            await this.connection.query(`EXEC p_CentrosNoChequeadosVsConsolidado @0, @1, @2`, [anio, periodo, idDivision]).then(res => {
                if (res.length) {
                    const _centros: any[] = [];
                    res.forEach(row => {
                        _centros.push(row.Unidad);
                    });

                    // enviar email ****

                    throw new Error(`Los siguientes Centros no han sido chequeados contra el Consolidado de la División ${ idDivision }.
                        Centros: ${ _centros.join(', ')}`);
                }
            }).catch(err => {
                throw new Error(err.message ? err.message : err);
            });
        // } catch (err) {
        //     return { success: false, error: err.message ? err.message : err };
        // }
    }

    private async _centrosDiferenciasVsConsolidado(idDivision: number, periodo: number): Promise<void> {
        // try {
            await this.connection.query(`EXEC p_CentrosDiferenciasVsConsolidado @0, @1`, [idDivision, periodo]).then(res => {
                if (res.length) {
                    const _centros: any[] = [];
                    res.forEach(row => {
                        _centros.push(row.Unidad);
                    });

                    // enviar email ****

                    throw new Error(`Centros que tienen diferencias contra el Consolidado de la División ${ idDivision } en el Período ${ periodo }.
                        Centros: ${ _centros.join(', ')}`);
                }
            }).catch(err => {
                throw new Error(err.message ? err.message : err);
            });
        // } catch (err) {
        //     return { success: false, error: err.message ? err.message : err };
        // }
    }

    private async _reporteConsultas(idUnidad: number, cons: string, periodo: number, idConsulta: number): Promise<ConciliaContaQueryResponse> {
        // try {
            const _query = queryReporteConsultas
                    .replace(/@Centro/g, idUnidad.toString())
                    .replace(/@Consolidado/g, cons)
                    .replace(/@Periodo/g, periodo.toString())
                    .replace(/@IdConsulta/g, idConsulta.toString());

            return new Promise<ConciliaContaQueryResponse>(resolve => {
                this.connection.query(_query).then(result => {
                    resolve({
                        success: true,
                        data: JSON.stringify(result)
                    });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        // } catch (err) {
        //     return { success: false, error: err.message ? err.message : err };
        // }
    }

    private async _reporteExpresiones(idUnidad: number, cons: string, periodo: number): Promise<ConciliaContaQueryResponse> {
        // try {
            const _query = queryReporteExpresiones
                    .replace(/@Centro/g, idUnidad.toString())
                    .replace(/@Consolidado/g, cons)
                    .replace(/@Periodo/g, periodo.toString());

            return new Promise<ConciliaContaQueryResponse>(resolve => {
                this.connection.query(_query).then(result => {
                    resolve({
                        success: true,
                        data: JSON.stringify(result)
                    });
                }).catch(err => {
                    throw new Error(err.message ? err.message : err);
                });
            });
        // } catch (err) {
        //     return { success: false, error: err.message ? err.message : err };
        // }
    }

    private async _reporteValores(idUnidad: number, cons: string, periodo: number): Promise<ConciliaContaQueryResponse> {
        // try {
            const _query = queryReporteValores
                    .replace(/@Centro/g, idUnidad.toString())
                    .replace(/@Consolidado/g, cons)
                    .replace(/@Periodo/g, periodo.toString());

            return new Promise<ConciliaContaQueryResponse>(resolve => {
                this.connection.query(_query).then(result => {
                    resolve({
                        success: true,
                        data: JSON.stringify(result)
                    });
                }).catch(err => {
                    throw new Error(err.message ? err.message : err);
                });
            });
        // } catch (err) {
        //     return { success: false, error: err.message ? err.message : err };
        // }
    }

    async importarInventarioRodas(annio: number, periodo: number, idUnidad: number, cons: string): Promise<MutationResponse> {
        // try {
            let query;
            if (cons === '1') {
                query = queryInventarioRodasCons.replace(/@Anio/g, annio.toString())
                                            .replace(/@Periodo/g, periodo.toString())
                                            .replace(/@Centro/g, idUnidad.toString());
            } else {
                query = queryInventarioRodas.replace(/@Anio/g, annio.toString())
                                .replace(/@Periodo/g, periodo.toString())
                                .replace(/@Centro/g, idUnidad.toString());
            }

            const _inventario: RodasInventario[] = await this.connection.query(query).then(result => {
                return result;
            }).catch(err => {
                throw new Error(err.message ? err.message : err);
            });

            if (_inventario) {
                for (let i = 0; i < _inventario.length; i++) {
                    const inventario = _inventario[i];

                    await this._rodasInventarioService.insertRodasInventario(inventario);
                    // if (!_insertInventarioRes.success) {
                    //     return { success: false, error: _insertInventarioRes.error };
                    // }
                }
            }

            return new Promise<MutationResponse>(resolve => {
                resolve({ success: true });
            });
        // } catch (err) {
        //     return { success: false, error: err.message ? err.message : err };
        // }
    }

    async importarVentasRodas(annio: number, periodo: number, idUnidad: number, cons: string, ventasAcumuladas: boolean): Promise<MutationResponse> {
        // try {
            let query = cons === '1' ? queryVentasRodasCons : queryVentasRodas;

            if (ventasAcumuladas) {
                query = query.replace(/= @Periodo/g, '<= @Periodo');
            }

            query = query.replace(/@Anio/g, annio.toString())
                    .replace(/@Periodo/g, periodo.toString())
                    .replace(/@Centro/g, idUnidad.toString());

            const _Ventas: RodasVentas[] = await this.connection.query(query).then(result => {
                return result;
            }).catch(err => {
                throw new Error(err.message ? err.message : err);
            });

            if (_Ventas) {
                for (let i = 0; i < _Ventas.length; i++) {
                    const Ventas = _Ventas[i];

                    await this._rodasVentasService.insertRodasVentas(Ventas);
                }
            }

            return new Promise<MutationResponse>(resolve => {
                resolve({ success: true });
            });
        // } catch (err) {
        //     return { success: false, error: err.message ? err.message : err };
        // }
    }

    async iniciarSaldos(iniciarSaldosInput: IniciarSaldosInput): Promise<MutationResponse> {
        try {
            const { idCentro, consolidado, annio } = iniciarSaldosInput;

            // borrar clasificador de cuentas
            this.connection.createQueryBuilder()
                .delete()
                .from('Clasificador_de_Cuentas')
                .where('Centro = :centro', { centro: idCentro })
                .andWhere('Consolidado = :cons', { cons: consolidado })
                .andWhere('Año = :annio', { annio: annio })
                .execute()
                .catch(err => {
                    throw new Error(err);
                });

            // borrar asientos
            this.connection.createQueryBuilder()
                .delete()
                .from('Conta_Asiento')
                .where('Centro = :centro', { centro: idCentro })
                .andWhere('Consolidado = :cons', { cons: consolidado })
                .andWhere('Año = :annio', { annio: annio })
                .execute()
                .catch(err => {
                    throw new Error(err);
                });

            // borrar mayor
            this.connection.createQueryBuilder()
                .delete()
                .from('Conta_Mayor')
                .where('Centro = :centro', { centro: idCentro })
                .andWhere('Consolidado = :cons', { cons: consolidado })
                .andWhere('Año = :annio', { annio: annio })
                .execute()
                .catch(err => {
                    throw new Error(err);
                });

            return new Promise<MutationResponse>(resolve => {
                resolve({ success: true });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async arreglaClasificadorCuenta(idUnidad: number, tipoUnidad: string, annio: string): Promise<MutationResponse> {
        try {
            // verificar si se ha definido la conexión al Rodas
            const _conexionRodasQuery = await this._contaConexionesService.getConexionByIdUnidad(idUnidad, tipoUnidad === '2');
            const _conexionConta = _conexionRodasQuery.data;
            _conexionConta.BaseDatos = _conexionConta.BaseDatos.substring(0, _conexionConta.BaseDatos.length - 4) + annio.toString();

            const _conexionCodif = cloneDeep(_conexionConta);
            _conexionCodif.BaseDatos = _conexionCodif.BaseDatos.substring(0, _conexionCodif.BaseDatos.length - 4).replace(/Conta/gi, 'Codif');

            const _codifConexion: Connection = await (await this._contaConexionesService.conexionRodas(_conexionCodif)).connect();
            const _contaConexion: Connection = await (await this._contaConexionesService.conexionRodas(_conexionConta)).connect();

            let tipoClasificador;

            switch (tipoUnidad) {
                case '0':
                    tipoClasificador = ETipoClasificadorCuenta.Centro
                    break;
                case '1':
                    tipoClasificador = ETipoClasificadorCuenta.Complejo
                    break;
                case '1':
                    tipoClasificador = ETipoClasificadorCuenta.Consolidado
                    break;
            }

            const _clasifCuentasRealQuery = await this._clasificadorCuentaSvc.getClasificadorCuentaByTipo(tipoClasificador);
            if (!_clasifCuentasRealQuery.success) {
                throw new Error(_clasifCuentasRealQuery.error);                
            }

            const _clasifCuentasReal = _clasifCuentasRealQuery.data;


            
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    private async _getClasificadorCuentaUnidad(): Promise<any> {

    }



    private async _arreglaClasificadorUnidad(): Promise<MutationResponse> {

        return new Promise<MutationResponse>(resolve => {
            resolve({ success: true })
        })

    }

}
