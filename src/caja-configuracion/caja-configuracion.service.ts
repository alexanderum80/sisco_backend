import { CajaConfiguracionInput } from './caja-configuracion.model';
import { Injectable } from '@nestjs/common';
import { CajaConfiguracionEntity } from './caja-configuracion.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CajaConfiguracionService {
  constructor(
    @InjectRepository(CajaConfiguracionEntity) private readonly cajaConfiguracionRepository: Repository<CajaConfiguracionEntity>
  ) {}

  async findAll(): Promise<CajaConfiguracionEntity[]> {
    try {
      return new Promise<CajaConfiguracionEntity[]>((resolve, reject) => {
        return this.cajaConfiguracionRepository.find().then(res => {
          resolve(res);
        }).catch(err => {
          reject(err.message || err);
        })
      });      
    } catch (err: any) {
      return Promise.reject(err.message || err);
    }
  }

  async findOne(id: number): Promise<CajaConfiguracionEntity> {
    try {
      return new Promise<CajaConfiguracionEntity>((resolve, reject) => {
        return this.cajaConfiguracionRepository.findOneOrFail(id).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err.message || err);
        })
      });      
    } catch (err: any) {
      return Promise.reject(err.message || err);
    }
  }

  async create(cajaConfiguracionInput: CajaConfiguracionInput): Promise<CajaConfiguracionEntity> {
    try {
      delete cajaConfiguracionInput.IdCaja;

      return new Promise<CajaConfiguracionEntity>((resolve, reject) => {
        return this.cajaConfiguracionRepository.save(cajaConfiguracionInput).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err.message || err);
        })
      });      
    } catch (err: any) {
      return Promise.reject(err.message || err);
    }
  }

  async update(cajaConfiguracionInput: CajaConfiguracionInput): Promise<CajaConfiguracionEntity> {
    try {
      return new Promise<CajaConfiguracionEntity>((resolve, reject) => {
        return this.cajaConfiguracionRepository.save(cajaConfiguracionInput).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err.message || err);
        })
      });      
    } catch (err: any) {
      return Promise.reject(err.message || err);
    }
  }

  async remove(id: number): Promise<number> {
    try {
      return new Promise<number>((resolve, reject) => {
        return this.cajaConfiguracionRepository.delete(id).then(res => {
          resolve(res.affected as number);
        }).catch(err => {
          reject(err.message || err);
        })
      });      
    } catch (err: any) {
      return Promise.reject(err.message || err);
    }
  }
}
