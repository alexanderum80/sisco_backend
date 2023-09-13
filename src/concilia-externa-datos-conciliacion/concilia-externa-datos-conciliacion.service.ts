import { ConciliaExternaDatosConciliacionEntity } from './entities/concilia-externa-datos-conciliacion.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ConciliaExternaDatosConciliacionService {
  constructor(@InjectRepository(ConciliaExternaDatosConciliacionEntity) private readonly conciliaExtContRepository: Repository<ConciliaExternaDatosConciliacionEntity>) {}

  async create(anno: number, mes: number): Promise<ConciliaExternaDatosConciliacionEntity> {
    try {
      return new Promise<ConciliaExternaDatosConciliacionEntity>((resolve, reject) => {
        const newDatosConciliacion = this.conciliaExtContRepository.create({ Annio: anno, Mes: mes });

        this.conciliaExtContRepository
          .save(newDatosConciliacion)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    } catch (err) {
      return Promise.reject(err.message);
    }
  }

  async findAll(): Promise<ConciliaExternaDatosConciliacionEntity[]> {
    try {
      return new Promise<ConciliaExternaDatosConciliacionEntity[]>((resolve, reject) => {
        this.conciliaExtContRepository
          .find()
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    } catch (err) {
      return Promise.reject(err.message);
    }
  }

  async findOne(id: number): Promise<ConciliaExternaDatosConciliacionEntity> {
    try {
      return new Promise<ConciliaExternaDatosConciliacionEntity>((resolve, reject) => {
        this.conciliaExtContRepository
          .findOneBy({ IdConciliacion: id })
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    } catch (err) {
      return Promise.reject(err.message);
    }
  }

  async findOneByAnnoMes(anno: number, mes: number): Promise<ConciliaExternaDatosConciliacionEntity> {
    try {
      return new Promise<ConciliaExternaDatosConciliacionEntity>((resolve, reject) => {
        this.conciliaExtContRepository
          .findOne({ where: { Annio: anno, Mes: mes } })
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    } catch (err) {
      return Promise.reject(err.message);
    }
  }

  async updateEstado(anno: number, mes: number, abierta: boolean): Promise<number> {
    try {
      return new Promise<number>((resolve, reject) => {
        this.conciliaExtContRepository
          .createQueryBuilder()
          .update()
          .set({ Abierta: abierta })
          .where('Annio = :annio', { annio: anno })
          .andWhere('Mes = :mes', { mes: mes })
          .execute()
          .then(res => {
            resolve(res.affected);
          })
          .catch(err => {
            reject(err);
          });
      });
    } catch (err) {
      return Promise.reject(err.message);
    }
  }
}
