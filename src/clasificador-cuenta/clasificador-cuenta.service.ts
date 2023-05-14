import { MutationResponse } from './../shared/models/mutation.response.model';
import { ClasificadorCuentaRealInput, CuentasAgrupadas } from './clasificador-cuenta.model';
import { Injectable } from '@nestjs/common';
import { ClasificadorCuentaRealEntity } from './clasificador-cuenta.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClasificadorCuentaService {
  constructor(@InjectRepository(ClasificadorCuentaRealEntity) private clasificadorCuentaRepository: Repository<ClasificadorCuentaRealEntity>) {}

  async getAllClasificadorCuentas(tipo?: number): Promise<ClasificadorCuentaRealEntity[]> {
    let _where = {};
    if (tipo) _where = { TipoClasificador: tipo };

    return new Promise<ClasificadorCuentaRealEntity[]>((resolve, reject) => {
      this.clasificadorCuentaRepository
        .find({ where: _where })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err.message || err);
        });
    });
  }

  async getClasificadorCuenta(cuenta: string, subcuenta: string, tipo: number): Promise<ClasificadorCuentaRealEntity> {
    return new Promise<ClasificadorCuentaRealEntity>((resolve, reject) => {
      this.clasificadorCuentaRepository
        .findOne({ where: [{ Cuenta: cuenta, SubCuenta: subcuenta, TipoClasificador: tipo }] })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err.message || err);
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

  async getCuentasAgrupadas(): Promise<CuentasAgrupadas[]> {
    return new Promise<CuentasAgrupadas[]>((resolve, reject) => {
      this.clasificadorCuentaRepository
        .createQueryBuilder('Clas')
        .select('Clas.Cuenta', 'Cuenta')
        .groupBy('Clas.Cuenta')
        .orderBy('Clas.Cuenta')
        .execute()
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err.message || err);
        });
    });
  }

  async saveClasificadorCuenta(clasificadorInfo: ClasificadorCuentaRealInput): Promise<MutationResponse> {
    return new Promise<MutationResponse>((resolve, reject) => {
      this.clasificadorCuentaRepository
        .save(clasificadorInfo)
        .then(() => {
          resolve({ success: true });
        })
        .catch(err => {
          reject(err.message || err);
        });
    });
  }

  async deleteClasificadorCuenta(cuenta: string, subcuenta: string, tipo: number): Promise<MutationResponse> {
    return new Promise<MutationResponse>(resolve => {
      this.clasificadorCuentaRepository
        .delete({ Cuenta: cuenta, SubCuenta: subcuenta, TipoClasificador: tipo })
        .then(() => {
          resolve({ success: true });
        })
        .catch(err => {
          resolve({ success: err.message ? err.message : err });
        });
    });
  }
}
