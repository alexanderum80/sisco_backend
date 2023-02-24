import { CuentaEntidadService } from './../cuenta-entidad/cuenta-entidad.service';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { ClasificadorCuentasQueryResponse, ClasificadorCuentaQueryResponse, ClasificadorCuentaRealInput, CuentasAgrupadasQueryResponse } from './clasificador-cuenta.model';
import { Injectable } from '@nestjs/common';
import { ClasificadorCuentaRealEntity } from './clasificador-cuenta.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClasificadorCuentaService {
  constructor(
    @InjectRepository(ClasificadorCuentaRealEntity) private clasificadorCuentaRepository: Repository<ClasificadorCuentaRealEntity>,
    private cuentaEntidadSvc: CuentaEntidadService,
  ) {}

  async getAllClasificadorCuentas(tipo?: number): Promise<ClasificadorCuentasQueryResponse> {
    let _where = {};
    if (tipo) _where = { TipoClasificador: tipo };
    return new Promise<ClasificadorCuentasQueryResponse>(resolve => {
      this.clasificadorCuentaRepository
        .find({ where: _where })
        .then(res => {
          resolve({ success: true, data: res });
        })
        .catch(err => {
          resolve({ success: false, error: err.message ? err.message : err });
        });
    });
  }

  async getClasificadorCuenta(cuenta: string, subcuenta: string, tipo: number): Promise<ClasificadorCuentaQueryResponse> {
    return new Promise<ClasificadorCuentaQueryResponse>(resolve => {
      this.clasificadorCuentaRepository
        .findOne({ where: [{ Cuenta: cuenta, SubCuenta: subcuenta, TipoClasificador: tipo }] })
        .then(res => {
          resolve({ success: true, data: res });
        })
        .catch(err => {
          resolve({ success: false, error: err.message ? err.message : err });
        });
    });
  }

  async getClasificadorCuentaByTipo(tipo: number): Promise<ClasificadorCuentaRealEntity[]> {
    return new Promise<ClasificadorCuentaRealEntity[]>((resolve, reject) => {
      this.clasificadorCuentaRepository
        .find({ where: [{ TipoClasificador: tipo }] })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err.message || err);
        });
    });
  }

  async getCuentasAgrupadas(): Promise<CuentasAgrupadasQueryResponse> {
    return new Promise<CuentasAgrupadasQueryResponse>(resolve => {
      this.clasificadorCuentaRepository
        .createQueryBuilder('Clas')
        .select('Clas.Cuenta', 'Cuenta')
        .groupBy('Clas.Cuenta')
        .orderBy('Clas.Cuenta')
        .execute()
        .then(res => {
          resolve({ success: true, data: res });
        })
        .catch(err => {
          resolve({ success: false, error: err.message ? err.message : err });
        });
    });
  }

  async saveClasificadorCuenta(clasificadorInfo: ClasificadorCuentaRealInput): Promise<MutationResponse> {
    return new Promise<MutationResponse>(resolve => {
      this.clasificadorCuentaRepository
        .save(clasificadorInfo)
        .then(res => {
          this.cuentaEntidadSvc.actualizaCuentaEntidad(res).then(() => {
            resolve({ success: true });
          });
        })
        .catch(err => {
          resolve({ success: false, error: err.message ? err.message : err });
        });
    });
  }

  async deleteClasificadorCuenta(cuenta: string, subcuenta: string, tipo: number): Promise<MutationResponse> {
    return new Promise<MutationResponse>(resolve => {
      this.clasificadorCuentaRepository
        .delete({ Cuenta: cuenta, SubCuenta: subcuenta, TipoClasificador: tipo })
        .then(() => {
          this.cuentaEntidadSvc.deleteCuentaEntidad(cuenta, subcuenta, tipo).then(res => {
            if (!res.success) {
              resolve({ success: false, error: res.error });
            } else {
              resolve({ success: true });
            }
          });
        })
        .catch(err => {
          resolve({ success: err.message ? err.message : err });
        });
    });
  }
}
