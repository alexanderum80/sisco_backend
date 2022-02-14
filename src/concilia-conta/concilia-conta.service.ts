import { Usuarios } from './../usuarios/usuarios.entity';
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
import { Injectable } from '@nestjs/common';
import { queryUltimoPeriodo, queryInventarioRodas, queryVentasRodas, queryInventarioRodasCons, queryVentasRodasCons, queryComprobantesRodas, queryAsientoRodas, queryMayorRodas, queryRangoAsientosMes, querySaldosAcumuladosRodas, ConciliaContaInput, queryClasificadorCuentasRodas, ConciliaContabilidadQueryResponse, queryReporteConsultas, ConciliaContaQueryResponse, queryReporteExpresiones, queryReporteValores, IniciarSaldosInput, ChequearCentrosInput } from './concilia-conta.model';
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

    async conciliaContabilidad(user: Usuarios, conciliaContaInput: ConciliaContaInput): Promise<ConciliaContabilidadQueryResponse> {
        try {
            const { IdDivision } = user;
            const { idCentro, periodo, annio, tipoCentro, tipoEntidad } = conciliaContaInput;
            const consolidado = tipoCentro === 2 ? '1' : '0';

            // verificar si se ha definido la conexión al Rodas
            const _conexionRodasQuery = await this._contaConexionesService.findByIdUnidad(idCentro, tipoCentro === 2);
            // if (!_conexionRodasQuery.success) {
            //     throw new Error(_conexionRodasQuery.error + ' No se pudo obtener la Conexión al Rodas del Centro ' + idCentro);
            // }
            const _conexionConta = _conexionRodasQuery.data;
            _conexionConta.BaseDatos = _conexionConta.BaseDatos.substring(0, _conexionConta.BaseDatos.length - 4) + annio.toString();

            // const _conexionCodif = cloneDeep(_conexionConta);
            // _conexionCodif.BaseDatos = _conexionCodif.BaseDatos.substring(0, _conexionCodif.BaseDatos.length - 4).replace(/Conta/gi, 'Codif');

            // importar el clasificador de cuentas
            // await this._importarClasificador(idCentro, tipoCentro, annio, consolidado, periodo, _conexionConta);
            // if (!_importarClasifCuentasRes.success) {
            //     throw new Error(_importarClasifCuentasRes.error.toString());
            // }

            // conecto al Conta del Centro
            let _contaConexionCentro: Connection = await this._contaConexionesService.conexionRodas(_conexionConta);

            // importar y chequear el clasificador de cuentas
            const _chequeaClasifRes = await this._importarClasificador(idCentro, tipoCentro, annio, consolidado, periodo, _contaConexionCentro);
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
            await this.importarContabilidad(idCentro, annio, periodo, consolidado, _contaConexionCentro);
            // if (!_importarAsientosRes.success) {
            //     throw new Error(_importarAsientosRes.error.toString());
            // }

            // cierro la conexión al Rodas del Centro
            if (_contaConexionCentro && _contaConexionCentro.isConnected)
            _contaConexionCentro.close();

            // calcular la conciliación
            let _error = '';
            await this._calculaConciliacion(idCentro, tipoCentro, annio, periodo, tipoEntidad, IdDivision).catch(err => {
                _error = err.message;
            });
            // if (!_calculaConciliacionRes.success) {
            //     throw new Error(_calculaConciliacionRes.error.toString());
            // }

            // validando información
            // if (tipoCentro === 2 && idCentro !== 100) {
            //     await this._centrosNoConciliados(annio, periodo, idCentro);
            //     // if (!_queryCentrosNoConciliados.success) {
            //     //     throw new Error(_queryCentrosNoConciliados.error.toString());
            //     // }

            //     await this._centrosNoChequeadosVsConsolidado(annio, periodo, idCentro);
            //     // if (!_queryCentrosNoChequeados.success) {
            //     //     throw new Error(_queryCentrosNoChequeados.error.toString());
            //     // }

            //     await this._centrosDiferenciasVsConsolidado(idCentro, periodo);
            //     // if (!_queryCentrosDiferenciasVsCons.success) {
            //     //     throw new Error(_queryCentrosDiferenciasVsCons.error.toString());
            //     // }
            // }

            // devuelvo el resultado de la conciliación
            return new Promise<ConciliaContabilidadQueryResponse>(resolve => {
                this._getReportesConciliacion(idCentro, consolidado, periodo).then(result => {
                    if (_error) {
                        result.success = false;
                        result.error = _error;
                    }

                    resolve(result);
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

    async _importarClasificador(idUnidad: number, tipoCentro: number, annio: number, cons: string, periodo: number, contaConexion: Connection): Promise<any> {
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
                this.connection.query(`EXEC dbo.pConta_ImportClasifCuentaXML @0, @1, @2, @3, @4, @5`, [_clasifCuentasXML, idUnidad, tipoClasif, cons, annio, periodo]).then(result => {
                    resolve({ data: result });
                }).catch(err => {
                    throw new Error(err.message ? err.message : err);
                });
            });
        } catch (err) {
            if (contaConexion && contaConexion.isConnected)
                contaConexion.close();

            throw new Error(err.message ? err.message : err);
        }
    }

    async importarContabilidad(idUnidad: number, annio: number, periodo: number, cons: string, contaConexion: Connection): Promise<void> {
        try {
            // obtener el ultimo periodo importado en el SISCO
            let _queryUltimoPeriodo = queryUltimoPeriodo.replace(/@Anio/g, annio.toString())
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
            // if (!_datosAdulteradosRes.success) {
            //     throw new Error(_datosAdulteradosRes.error.toString());
            // }

            // chequear saldos acumulados hasta el periodo anterior
            await this._chequearSaldoAcumulados(idUnidad, annio, _ultimoPeriodo, cons, contaConexion);

            const _periodoInicial = _ultimoPeriodo < periodo ? _ultimoPeriodo : periodo;

            for (let per = _periodoInicial; per <= periodo; per++) {
                // importar los comprobantes
                await this._importarComprobantes(idUnidad, annio, per, cons, contaConexion);
                // if (!_importarCompRes.success) {
                //     throw new Error(_importarCompRes.error.toString());
                // }

                // importar los asientos
                await this._importarAsientos(idUnidad, annio, per, cons, contaConexion);
                // if (!_importarAsientoRes.success) {
                //     throw new Error(_importarAsientoRes.error.toString());
                // }

                // importar mayor
                await this._importarMayor(idUnidad, annio, periodo, cons, contaConexion);
                // if (!_importarMayorRes.success) {
                //     throw new Error(_importarMayorRes.error.toString());
                // }
            }

        } catch (err) {
            if (contaConexion && contaConexion.isConnected)
                contaConexion.close();

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

    private async _importarComprobantes(idUnidad: number, annio: number, periodo: number, cons: string, rodasConexion: Connection): Promise<void> {
        // try {
            const _queryComprobantes = queryComprobantesRodas.replace(/@Periodo/g, periodo.toString());
            const _queryCompRes = await rodasConexion.query(_queryComprobantes).then(result => {
                return result;
            }).catch(err => {
                throw new Error(err.message ? err.message : err);
            });

            if (_queryCompRes.length) {
                const _comprobantes = this._xmlJsService.jsonToXML('Comprobantes', _queryCompRes);
                
                await this.connection.query(`EXEC dbo.pConta_ImportComprobanteXML @0, @1, @2, @3, @4`, [_comprobantes, idUnidad, cons, annio, periodo]).catch(err => {
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
                return result;
            }).catch(err => {
                throw new Error(err.message ? err.message : err);
            });

            // let _asientosArray = [];
            // for (let i = 0; i < _queryAsientosRes.data.length; i++) {
            //     const element = _queryAsientosRes.data[i];
            //     _asientosArray.push({
            //         Asiento: element
            //     });
            // }
            
            if (_queryAsientosRes.length) {
                const _asientos = this._xmlJsService.jsonToXML('Asiento', _queryAsientosRes);

                await this.connection.query(`EXEC dbo.pConta_ImportAsientoXML @0, @1, @2, @3, @4`, [_asientos, idUnidad, cons, annio, periodo]).catch(err => {
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
                return result;
            }).catch(err => {
                throw new Error(err.message ? err.message : err);
            });
            
            if (_queryMayorRes.length) {
                const _mayor = this._xmlJsService.jsonToXML('Mayor', _queryMayorRes);

                await this.connection.query(`EXEC dbo.pConta_ImportMayorXML @0, @1, @2, @3, @4`, [_mayor, idUnidad, cons, annio, periodo]).catch(err => {
                    throw new Error(err.message ? err.message : err);
                });
            }
        // } catch (err) {
        //     return { success: false, error: err.message ? err.message : err };
        // }
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

        await this.connection.query(`EXEC dbo.pConta_CalculaConciliacion @0, @1, @2, @3, @4, @5, @6`, [idUnidad, tipoClasificador, tipoEntidad, cons, anio, periodo, idDivision]).catch(err => {
            throw new Error(err.message ? err.message : err);
        });
    }

    private async _getReportesConciliacion(idCentro: number, consolidado: string, periodo: number): Promise<ConciliaContabilidadQueryResponse> {
        // devuelvo el resultado de la conciliación
        const _queryReporteConsultas = this._reporteConsultas(idCentro, consolidado, periodo, 1);
        const _queryReporteExpresiones = this._reporteExpresiones(idCentro, consolidado, periodo);
        const _queryReporteValores = this._reporteValores(idCentro, consolidado, periodo);

        return new Promise<ConciliaContabilidadQueryResponse>(resolve => {
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

            return new Promise<MutationResponse>(resolve => {
                this.connection.query(`EXEC dbo.pConta_InicializarDatos @0, @1, @2`, [idCentro, consolidado, annio]).then(() => {
                    resolve({ success: true })
                })
                .catch(err => {
                    return { success: false, error: err.message ? err.message : err };
                });
            });
        } catch (err) {
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

    async chequearCentro(chequearCentrosInput: ChequearCentrosInput): Promise<ConciliaContaQueryResponse> {
        try {
            const { idCentro, annio, periodo, centrosAChequear } = chequearCentrosInput;

            const cons = idCentro === 100 ? 1 : 0;

            for (let index = 0; index < centrosAChequear.length; index++) {
                const centroChe = centrosAChequear[index];
                
                await this.connection.query(`EXEC dbo.InsertChequeoCentroVsConsolidado @0, @1, @2, @3, @4`, [idCentro, cons, annio, periodo, centroChe])
                .catch(err => {
                    throw new Error(err.message ? err.message : err);
                });
            }

            return new Promise<ConciliaContaQueryResponse>(resolve => {
                this.connection.query(`EXEC dbo.p_ChequeoCentro @0`, [`Centro = ${ idCentro } AND Periodo = ${ periodo } AND Unidad IN (${ centrosAChequear.join(', ') })`]).then(result => {
                    resolve({ success: true, data: JSON.stringify(result) });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

}
