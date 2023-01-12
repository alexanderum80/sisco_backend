import { ConciliaExternaDwhService } from './../concilia-externa-dwh/concilia-externa-dwh.service';
import { Injectable } from '@nestjs/common';
import { ConciliaExtContabilidadService } from '../concilia-externa-contabilidad/concilia-externa-contabilidad.service';
import { ConciliaExternaInput } from './dto/concilia-externa.input';
import { ConciliaExternaEntity } from './entities/concilia-externa.entity';
import { ConciliaExternaEntreUnidadesService } from 'src/concilia-externa-entre-unidades/concilia-externa-entre-unidades.service';

@Injectable()
export class ConciliaExternaService {
  constructor(
    private conciliaExtDWHSvc: ConciliaExternaDwhService,
    private conciliaExtContabSvc: ConciliaExtContabilidadService,
    private conciliaExtUnidadesSvc: ConciliaExternaEntreUnidadesService,
  ) {}

  async getConciliacion(conciliaExternaInput: ConciliaExternaInput): Promise<ConciliaExternaEntity> {
    try {
      const { Annio, Mes, Division, Unidad, DivisionOD, UnidadOD } = conciliaExternaInput;

      const getRecDifCantidad = this.conciliaExtDWHSvc.recepcionesDifCantidad(Annio, Mes, Division, Unidad, DivisionOD, UnidadOD);
      const getConciliaDWH = this.conciliaExtDWHSvc.conciliacionDWH(Annio, Mes, Division, Unidad, DivisionOD, UnidadOD);
      const getConciliaContab = this.conciliaExtContabSvc.conciliacionContab(Annio, Mes, Division, Unidad, DivisionOD, UnidadOD);
      const getActaConciliacion = this.conciliaExtContabSvc.actaConciliacion(Annio, Mes, Unidad, UnidadOD);
      const createConcUnidadEmisor = this.conciliaExtUnidadesSvc.createConciliacionEntreUnidades(Annio, Mes, Unidad, UnidadOD);
      const createConcUnidadReceptor = this.conciliaExtUnidadesSvc.createConciliacionEntreUnidades(Annio, Mes, UnidadOD, Unidad);

      return new Promise<ConciliaExternaEntity>((resolve, reject) => {
        Promise.all([getRecDifCantidad, getConciliaDWH, getConciliaContab, getActaConciliacion, createConcUnidadEmisor, createConcUnidadReceptor])
          .then(result => {
            const _data: ConciliaExternaEntity = {
              getRecDifCantidad: result[0] as any,
              getConciliaDWH: result[1] as any,
              getConciliaContab: result[2] as any,
              getActaConciliacion: result[3] as any,
              createConcUnidadEmisor: result[4] as any,
              createConcUnidadReceptor: result[5] as any,
            };
            resolve(_data);
          })
          .catch(err => {
            return reject(err);
          });
      });
    } catch (err) {
      return Promise.reject(err.message || err);
    }
  }
}
