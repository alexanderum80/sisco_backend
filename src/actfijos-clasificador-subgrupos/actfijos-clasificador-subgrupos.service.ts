import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ActFijosClasificadorSubgrupoInput } from './dto/actfijos-clasificador-subgrupo.input';
import { ActFijosClasificadorSubgrupoEntity } from './entities/actfijos-clasificador-subgrupo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActfijosClasificadorSubgruposService {
  constructor(@InjectRepository(ActFijosClasificadorSubgrupoEntity) private readonly clasificadorSubgruposRepository: Repository<ActFijosClasificadorSubgrupoEntity>) {}

  async findAll(): Promise<ActFijosClasificadorSubgrupoEntity[]> {
    try {
      return new Promise<ActFijosClasificadorSubgrupoEntity[]>((resolve, reject) => {
        this.clasificadorSubgruposRepository
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

  async findOne(grupo: number, codigo: number): Promise<ActFijosClasificadorSubgrupoEntity> {
    try {
      return new Promise<ActFijosClasificadorSubgrupoEntity>((resolve, reject) => {
        this.clasificadorSubgruposRepository
          .findOne({ where: { Grupo: grupo, Codigo: codigo } })
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

  async save(createActfijosClasificadorSubgrupoInput: ActFijosClasificadorSubgrupoInput): Promise<ActFijosClasificadorSubgrupoEntity> {
    try {
      return new Promise<ActFijosClasificadorSubgrupoEntity>((resolve, reject) => {
        this.clasificadorSubgruposRepository
          .save(createActfijosClasificadorSubgrupoInput)
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

  async remove(grupo: number, codigo: number): Promise<number> {
    try {
      const subgrupo = await this.findOne(grupo, codigo).catch(err => {
        throw new Error(err);
      });

      return new Promise<number>((resolve, reject) => {
        this.clasificadorSubgruposRepository
          .delete(subgrupo)
          .then(res => {
            resolve(res.affected);
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
