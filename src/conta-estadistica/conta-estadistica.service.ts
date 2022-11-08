import { ContaEstadisticaInput } from './dto/conta-estadistica.input';
import { Injectable } from '@nestjs/common';
import { ContaEstadisticaView } from './entities/conta-estadistica.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ContaEstadisticaService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findAll(contaEstadisticaInput: ContaEstadisticaInput): Promise<ContaEstadisticaView[]> {
    const { idDivision, annio, periodo } = contaEstadisticaInput;

    return new Promise<ContaEstadisticaView[]>((resolve, reject) => {
      this.dataSource.manager
        .query('EXEC pConta_Estadistica @0, @1, @2', [idDivision, annio, periodo])
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
