import { ContaInformeCtasCobrarPagarView } from './entities/conta-informe-ctas-cobrar-pagar.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ContaInformeCtasCobrarPagarService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findAll(idDivision: number, annio: number, periodo: number): Promise<ContaInformeCtasCobrarPagarView[]> {
    try {
      return new Promise<ContaInformeCtasCobrarPagarView[]>((resolve, reject) => {
        this.dataSource
          .query('select * from conta_informe_cuentas_por_cobrar_pagar ($1, $2, $3)', [idDivision, annio, periodo])
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
}
