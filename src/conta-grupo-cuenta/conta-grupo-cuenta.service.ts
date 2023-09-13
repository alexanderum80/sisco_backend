import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { GrupoCuentaEntity } from './entities/conta-grupo-cuenta.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContaGrupoCuentaService {
  constructor(@InjectRepository(GrupoCuentaEntity) private readonly grupoCuentaRepository: Repository<GrupoCuentaEntity>) {}

  async findAll(): Promise<GrupoCuentaEntity[]> {
    try {
      return new Promise<GrupoCuentaEntity[]>((resolve, reject) => {
        this.grupoCuentaRepository
          .find()
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err.message || err);
          });
      });
    } catch (err) {
      throw new Error(err.message || err);
    }
  }

  async findOne(id: string): Promise<GrupoCuentaEntity> {
    try {
      return new Promise<GrupoCuentaEntity>((resolve, reject) => {
        this.grupoCuentaRepository
          .findOne({ where: { IdGrupo: id } })
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err.message || err);
          });
      });
    } catch (err) {
      throw new Error(err.message || err);
    }
  }
}
