import { cloneDeep } from 'lodash';
import { ConciliaContaService } from './../concilia-conta/concilia-conta.service';
import { ContaConexionesService } from './../conta-conexiones/conta-conexiones.service';
import { ConciliaAftInput, queryMbSubgrupos, ConciliaAftData, DiferenciaClasificadorCNMB, queryMbSinCuentas, queryMb } from './concilia-aft.model';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ContaConexionesEntity } from './../conta-conexiones/conta-conexiones.entity';

@Injectable()
export class ConciliaAftService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource, private _contaConexionesSvc: ContaConexionesService, private _conciliaContaSvc: ConciliaContaService) {}

  async concilia(conciliaAftInput: ConciliaAftInput): Promise<ConciliaAftData> {
    try {
      const { idCentro, annio, periodo } = conciliaAftInput;

      // verificar si se ha definido la conexión al Rodas
      const _conexionConta = await this._contaConexionesSvc.findByIdUnidad(idCentro, false).catch(err => {
        throw new Error(err);
      });

      const _conexionMB = cloneDeep(_conexionConta);
      _conexionMB.BaseDatos = _conexionMB.BaseDatos.replace(/Conta/gi, 'MB');

      // importo los datos de los activos
      const _chequeaClasifSubgrupos = await this._importarDatosAF(idCentro, annio, periodo, _conexionMB).catch(err => {
        throw new Error(err);
      });

      if ((_chequeaClasifSubgrupos as DiferenciaClasificadorCNMB[]).length) {
        return { DiferenciaClasificadorCNMB: _chequeaClasifSubgrupos as DiferenciaClasificadorCNMB[] };
      }

      // importo los datos de la contabilidad
      await this._importarDatosRodas(annio, periodo, idCentro, 0, _conexionConta).catch(err => {
        throw new Error(err);
      });

      return new Promise<ConciliaAftData>(async (resolve, reject) => {
        // calculo la conciliacion
        this._calculaConciliacion(idCentro, annio, periodo)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            return reject(err.message || err);
          });
      });
    } catch (err) {
      throw new Error(err.message || err);
    }
  }

  private async _importarDatosAF(idCentro: number, anno: number, periodo: number, conexionRodas: ContaConexionesEntity): Promise<void | DiferenciaClasificadorCNMB[]> {
    const mbConnection = await this._contaConexionesSvc.conexionRodas(conexionRodas);

    return new Promise<void | DiferenciaClasificadorCNMB[]>(async (resolve, reject) => {
      // importo el clasificador Subgrupos
      this._importarSubgruposAF(idCentro, anno, mbConnection)
        .then(_clasifCNMB => {
          // compruebo si hay diferencias en el caslificador CNMB
          if (_clasifCNMB.length) return resolve(_clasifCNMB);
          // importo los MB
          else
            this._importarMbAF(idCentro, anno, periodo, mbConnection)
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

  private async _importarSubgruposAF(idCentro: number, anno: number, conexionRodas: DataSource): Promise<DiferenciaClasificadorCNMB[]> {
    return new Promise<DiferenciaClasificadorCNMB[]>((resolve, reject) => {
      conexionRodas
        .query(queryMbSubgrupos)
        .then(async _subgrupos => {
          if (_subgrupos.length) {
            this.dataSource
              .query(`SELECT * from public.aft_import_subgrupos($1::json, $2::int, $3::int)`, [JSON.stringify(_subgrupos), idCentro, anno])
              .then(res => {
                resolve(res);
              })
              .catch(err => {
                reject(err.message ? err.message : err);
              });
          } else {
            reject('No existen Subgrupos definidos en el Rodas de este Centro. <br>No se puede realizar la Conciliación.');
          }
        })
        .catch((err: Error) => {
          reject(err.message || err);
        });
    });
  }

  private async _importarMbAF(idCentro: number, anno: number, periodo: number, conexionRodas: DataSource): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // chequeo si todos los MB tienen cuentas
      this._chequeaMbSinCuentas(conexionRodas)
        .then(() => {
          // importo los MB
          this._importarMb(idCentro, anno, periodo, conexionRodas)
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

  private async _importarMb(idCentro: number, anno: number, periodo: number, conexionRodas: DataSource): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      conexionRodas
        .query(
          queryMb
            .replace(/@Centro/gi, idCentro.toString())
            .replace(/@Anno/gi, anno.toString())
            .replace(/@Periodo/gi, periodo.toString()),
        )
        .then(_mb => {
          if (_mb.length) {
            this.dataSource
              .query(`CALL public.aft_import_mb($1, $2, $3, $4)`, [JSON.stringify(_mb), idCentro, anno, periodo])
              .then(() => {
                resolve();
              })
              .catch(err => {
                reject(err.message ? err.message : err);
              });
          } else {
            reject('No existen datos de los Activos Fijos en el período seleccionado. <br/>No se puede realizar la Conciliación.');
          }
        })
        .catch(err => {
          return reject(err.message ? err.message : err);
        });
    });
  }

  private async _importarDatosRodas(annio: number, periodo: number, idUnidad: number, tipoCentro: number, contaConexion: ContaConexionesEntity): Promise<boolean> {
    const cons = tipoCentro === 1;

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
        .query(`SELECT * FROM public.aft_calcula_conciliacion ($1, $2, $3)`, [idCentro, annio, periodo])
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
