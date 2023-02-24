import { ClaseCuentaEntity } from './entities/conta-clase-cuenta.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ContaClaseCuentaService {
  constructor(@InjectRepository(ClaseCuentaEntity) private readonly claseCuentaRepository: Repository<ClaseCuentaEntity>) {}

  async findAll(): Promise<ClaseCuentaEntity[]> {
    try {
      return new Promise<ClaseCuentaEntity[]>((resolve, reject) => {
        this.claseCuentaRepository
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

  async findOne(id: number): Promise<ClaseCuentaEntity> {
    try {
      return new Promise<ClaseCuentaEntity>((resolve, reject) => {
        this.claseCuentaRepository
          .findOne({ where: { ID: id } })
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

  async findByGrupo(idGrupo: string): Promise<ClaseCuentaEntity[]> {
    try {
      return new Promise<ClaseCuentaEntity[]>((resolve, reject) => {
        this.claseCuentaRepository
          .find({ where: { IdGrupo: idGrupo } })
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
