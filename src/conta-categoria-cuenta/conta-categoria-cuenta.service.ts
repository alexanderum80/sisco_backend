import { CategoriaCuentaEntity } from './entities/conta-categoria-cuenta.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ContaCategoriaCuentaService {
  constructor(@InjectRepository(CategoriaCuentaEntity) private readonly categoriaCuentaRepository: Repository<CategoriaCuentaEntity>) {}

  async findAll(): Promise<CategoriaCuentaEntity[]> {
    try {
      return new Promise<CategoriaCuentaEntity[]>((resolve, reject) => {
        this.categoriaCuentaRepository
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

  async findOne(id: string): Promise<CategoriaCuentaEntity> {
    try {
      return new Promise<CategoriaCuentaEntity>((resolve, reject) => {
        this.categoriaCuentaRepository
          .findOne({ where: { IdCategoria: id } })
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

  async findByClase(idClase: number): Promise<CategoriaCuentaEntity[]> {
    try {
      return new Promise<CategoriaCuentaEntity[]>((resolve, reject) => {
        this.categoriaCuentaRepository
          .find({ where: { IdClase: idClase } })
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
