import { ContaConexionesEntity } from './../conta-conexiones/conta-conexiones.entity';
import { ConciliaUhInput, ConciliaUH, queryUhCategorias, queryUhProductos, queryUh } from './concilia-uh.model';
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
      _conexionConta.BaseDatos = `r4_${_conexionConta.BaseDatos.toLowerCase()}`;

      return new Promise<ConciliaUH[]>((resolve, reject) => {
        // importo los datos de los Utiles
        this._importarDatosUH(idCentro, annio, periodo, _conexionConta)
          .then(() => {
            // importo los datos de la contabilidad
            this._importarDatosRodas(annio, periodo, idCentro, 0, _conexionConta)
              .then(() => {
                // calculo la conciliacion
                this._calculaConciliacion(idCentro, annio, periodo)
                  .then(res => {
                    resolve(res);
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
    } catch (err) {
      return Promise.reject(err.message || err);
    }
  }

  private async _importarDatosUH(idCentro: number, anno: number, periodo: number, conexionRodas: ContaConexionesEntity): Promise<void> {
    // try {
    const mbConnection = await this._contaConexionesSvc.conexionRodas(conexionRodas);

    return new Promise<void>((resolve, reject) => {
      // importo las Categorias
      this._importarCategoriaUH(idCentro, anno, mbConnection)
        .then(() => {
          // importo los Productos
          this._importarProductosUH(idCentro, anno, mbConnection)
            .then(() => {
              // importo los UH
              this._importarUH(idCentro, anno, periodo, mbConnection)
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

  private async _importarCategoriaUH(idCentro: number, anno: number, conexionRodas: DataSource): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      conexionRodas
        .query(queryUhCategorias.replace(/@anno/gi, anno.toString()))
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
        .then(async res => {
          if (res.length) {
            const _productos = this._xmlSvc.jsonToXML('Producto', res);

            await this.dataSource
              .query(`EXEC dbo.pUH_ImportProductosXML @0, @1`, [_productos, idCentro])
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

  private async _importarUH(idCentro: number, anno: number, periodo: number, conexionRodas: DataSource): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      conexionRodas
        .query(
          queryUh
            .replace(/@centro/gi, idCentro.toString())
            .replace(/@anno/gi, anno.toString())
            .replace(/@periodo/gi, periodo.toString()),
        )
        .then(res => {
          if (res.length) {
            const _uh = this._xmlSvc.jsonToXML('UH', res);

            // inserto los MB
            this.dataSource
              .query(`EXEC dbo.pUH_ImportUtilesXML @0, @1, @2`, [_uh, idCentro, periodo])
              .then(() => {
                resolve();
              })
              .catch(err => {
                reject(err.message ? err.message : err);
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

  private async _importarDatosRodas(annio: number, periodo: number, idUnidad: number, tipoCentro: number, contaConexion: ContaConexionesEntity): Promise<boolean> {
    const cons = tipoCentro === 1 ? '1' : '0';

    return new Promise<boolean>(resolve => {
      // me conecto al Rodas del Centro
      this._contaConexionesSvc
        .conexionRodas(contaConexion)
        .then(rodasConnection => {
          // importo los asientos del Rodas
          this._conciliaContaSvc
            .importarContabilidad(idUnidad, annio, periodo, cons, rodasConnection)
            .then(() => {
              resolve(true);
            })
            .catch(err => {
              throw new Error(err.message || err);
            });
        })
        .catch(err => {
          throw new Error(err.message || err);
        });
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
