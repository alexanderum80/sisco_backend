import { ConciliaExtContabilidadService } from './../concilia-externa-contabilidad/concilia-externa-contabilidad.service';
import { ConciliaExternaEntreUnidadesEntity, ConciliaExternaCentrosNoConciliados } from './entities/concilia-externa-entre-unidades.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConciliacionExternaEntreUnidadesInput } from './dto/concilia-externa-entre-unidades.input';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ConciliaExternaEntreUnidadesService {
  constructor(
    @InjectDataSource() private readonly connection: DataSource,
    @InjectRepository(ConciliaExternaEntreUnidadesEntity) private readonly conciliacionUnidadesRepository: Repository<ConciliaExternaEntreUnidadesEntity>,
    private conciliaContabSvc: ConciliaExtContabilidadService,
  ) {}

  async getConciliacionEntreUnidades(annio: number, mes: number, unidad: number, unidadOD: number): Promise<ConciliaExternaEntreUnidadesEntity | null> {
    try {
      return new Promise<ConciliaExternaEntreUnidadesEntity | null>((resolve, reject) => {
        this.conciliacionUnidadesRepository
          .findOne({ where: { Annio: annio, Mes: mes, IdUnidad: unidad, IdUnidadOD: unidadOD } })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err.message || err);
          });
      });
    } catch (err) {
      return Promise.reject(err.message || err);
    }
  }

  async createConciliacionEntreUnidades(annio, mes, unidad, unidadOD): Promise<ConciliaExternaEntreUnidadesEntity> {
    const _concilia = this.conciliacionUnidadesRepository.create({
      Annio: annio,
      Mes: mes,
      IdUnidad: unidad,
      IdUnidadOD: unidadOD,
    });

    return new Promise<ConciliaExternaEntreUnidadesEntity>((resolve, reject) => {
      if (unidad === 0 || unidadOD === 0) {
        resolve(_concilia);
      }

      this.getConciliacionEntreUnidades(annio, mes, unidad, unidadOD)
        .then(res => {
          if (res) {
            resolve(res);
          } else {
            this.conciliacionUnidadesRepository
              .save(_concilia)
              .then(result => {
                resolve(result);
              })
              .catch(err => {
                reject(err.message || err);
              });
          }
        })
        .catch(err => {
          reject(err.message || err);
        });
    });
  }

  async updateConciliacionEntreUnidades(data: ConciliacionExternaEntreUnidadesInput): Promise<number> {
    try {
      return new Promise<number>((resolve, reject) => {
        this.getConciliacionEntreUnidades(data.Annio, data.Mes, data.IdUnidad, data.IdUnidadOD)
          .then(res => {
            const stringQuery = `update ConciliacionEntreUnidades
                        set UsuarioEmisor = ${data.IdUsuarioEmisor},
                            UsuarioReceptor = ${data.IdUsuarioReceptor},
                            UsuarioSupervisor = ${data.IdUsuarioSupervisor},
                            Nota = '${data.Nota}'
                        where ID = ${res.ID}`;
            this.connection
              .query(stringQuery)
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
      });
    } catch (err) {
      return Promise.reject(err.message || err);
    }
  }

  async getCentrosNoConciliados(annio: number, mes: number): Promise<ConciliaExternaCentrosNoConciliados[]> {
    try {
      const centros: ConciliaExternaCentrosNoConciliados[] = [];

      return new Promise<ConciliaExternaCentrosNoConciliados[]>(async (resolve, reject) => {
        this.conciliaContabSvc
          .getCentrosConOperaciones(annio, mes)
          .then(async res => {
            for (let index = 0; index < res.length; index++) {
              const element = res[index];

              const stringQuery = `SELECT * FROM dbo.ConciliacionEntreUnidades
                            WHERE Annio = ${annio} AND Mes = ${mes} AND
                            ((Unidad = ${element.emisor} AND UnidadOD = ${element.receptor}) OR (Unidad = ${element.receptor} AND UnidadOD = ${element.emisor}))`;
              const result = await this.connection.query(stringQuery).catch(err => {
                reject(err.message || err);
              });

              if (result.length === 0) {
                centros.push({
                  Emisor: element.emisor.toString(),
                  Receptor: element.receptor.toString(),
                });
              }
            }

            resolve(centros);
          })
          .catch(err => {
            reject(err.message || err);
          });
      });
    } catch (err) {
      return Promise.reject(err.message || err);
    }
  }
}
