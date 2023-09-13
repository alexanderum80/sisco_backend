import { ContaConexionesEntity } from './../conta-conexiones/conta-conexiones.entity';
import { ConciliaUhInput, ConciliaUH, queryUhCategorias, queryUhProductos, queryUh } from './concilia-uh.model';
import { ConciliaContaService } from './../concilia-conta/concilia-conta.service';
import { ContaConexionesService } from './../conta-conexiones/conta-conexiones.service';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ConciliaUhService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource, private _contaConexionesSvc: ContaConexionesService, private _conciliaContaSvc: ConciliaContaService) {}

  async concilia(conciliaUhInput: ConciliaUhInput): Promise<ConciliaUH[]> {
    try {
      const { idCentro, annio, periodo } = conciliaUhInput;

      // verificar si se ha definido la conexión al Rodas
      const _conexionConta = await this._contaConexionesSvc.findByIdUnidad(idCentro, false).catch(err => {
        throw new Error(err);
      });

      // importo los datos de los Utiles
      await this._importarDatosUH(idCentro, annio, periodo, _conexionConta).catch(err => {
        throw new Error(err);
      });

      // importo los datos de la contabilidad
      await this._importarDatosRodas(annio, periodo, idCentro, 0, _conexionConta).catch(err => {
        throw new Error(err);
      });

      return new Promise<ConciliaUH[]>((resolve, reject) => {
        // calculo la conciliacion
        this._calculaConciliacion(idCentro, annio, periodo)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err.message || err);
          });
      });
    } catch (err) {
      return Promise.reject(err.message || err);
    }
  }

  private async _importarDatosUH(idCentro: number, anno: number, periodo: number, conexionRodas: ContaConexionesEntity): Promise<void> {
    // try {
    const mbConnection = await this._contaConexionesSvc.conexionRodas(conexionRodas);

    // importo las Categorias
    await this._importarCategoriaUH(idCentro, anno, mbConnection).catch(err => {
      throw new Error(err);
    });

    // importo los Productos
    await this._importarProductosUH(idCentro, anno, mbConnection).catch(err => {
      throw new Error(err);
    });

    // importo los UH
    await this._importarInventarioUH(idCentro, anno, periodo, mbConnection).catch(err => {
      throw new Error(err);
    });
  }

  private async _importarCategoriaUH(idCentro: number, anno: number, conexionRodas: DataSource): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      conexionRodas
        .query(queryUhCategorias.replace(/@anno/gi, anno.toString()))
        .then(async _categoria => {
          if (_categoria.length) {
            await this.dataSource
              .query(`CALL UH_Import_Categoria ($1::json, $2::int)`, [JSON.stringify(_categoria), idCentro])
              .then(() => {
                resolve();
              })
              .catch(err => {
                reject(err.message || err);
              });
          } else {
            resolve();
          }
        })
        .catch((err: Error) => {
          reject(err.message || err);
        });
    });
  }

  private async _importarProductosUH(idCentro: number, anno: number, conexionRodas: DataSource): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      conexionRodas
        .query(queryUhProductos.replace(/@anno/gi, anno.toString()))
        .then(async _productos => {
          if (_productos.length) {
            await this.dataSource
              .query(`CALL UH_Import_Productos ($1::json, $2::int)`, [JSON.stringify(_productos), idCentro])
              .then(() => {
                resolve();
              })
              .catch(err => {
                reject(err.message || err);
              });
          } else {
            resolve();
          }
        })
        .catch((err: Error) => {
          reject(err.message || err);
        });
    });
  }

  private async _importarInventarioUH(idCentro: number, anno: number, periodo: number, conexionRodas: DataSource): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      conexionRodas
        .query(
          queryUh
            .replace(/@centro/gi, idCentro.toString())
            .replace(/@anno/gi, anno.toString())
            .replace(/@periodo/gi, periodo.toString()),
        )
        .then(_uh => {
          if (_uh.length) {
            // inserto los MB
            this.dataSource
              .query(`CALL UH_Import_inventario ($1::json, $2::int, $3::int)`, [JSON.stringify(_uh), idCentro, periodo])
              .then(() => {
                resolve();
              })
              .catch(err => {
                reject(err.message || err);
              });
          } else {
            reject('No existen datos de los Útiles y Herramientas del período seleccionado. <br/>No se puede realizar la Conciliación.');
          }
        })
        .catch((err: Error) => {
          return reject(err.message || err);
        });
    });
  }

  private async _importarDatosRodas(annio: number, periodo: number, idUnidad: number, tipoCentro: number, contaConexion: ContaConexionesEntity): Promise<void> {
    const cons = tipoCentro === 1;

    return new Promise<void>((resolve, reject) => {
      // me conecto al Rodas del Centro
      this._contaConexionesSvc
        .conexionRodas(contaConexion)
        .then(rodasConnection => {
          // importo los asientos del Rodas
          this._conciliaContaSvc
            .importarContabilidad(idUnidad, annio, periodo, cons, rodasConnection)
            .then(() => {
              resolve();
            })
            .catch(err => {
              reject(err.message || err);
            });
        })
        .catch(err => {
          return reject(err.message || err);
        });
    });
  }

  private _calculaConciliacion(idCentro: number, annio: number, periodo: number): Promise<ConciliaUH[]> {
    return new Promise<ConciliaUH[]>((resolve, reject) => {
      this.dataSource
        .query(`select * from UH_Calcula_Conciliacion ($1::int, $2::int, $3::int)`, [idCentro, annio, periodo])
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err.message || err);
        });
    });
  }
}
