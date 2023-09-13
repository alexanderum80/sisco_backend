import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConciliaInternaContaInput } from './dto/concilia-interna-conta.input';
import { ConciliaInternaConta } from './entities/concilia-interna-conta.entity';

@Injectable()
export class ConciliaInternaContaService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findAll(conciliaInternaContaInput: ConciliaInternaContaInput): Promise<ConciliaInternaConta> {
    const { annio, periodo, centro, unidad, emisorReceptor } = conciliaInternaContaInput;
    return new Promise<ConciliaInternaConta>((resolve, reject) => {
      this.dataSource
        .query('select * from conta_cuadre_operaciones_dependencias ($1, $2, $3, $4, $5)', [annio, periodo, centro, unidad, emisorReceptor])
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
