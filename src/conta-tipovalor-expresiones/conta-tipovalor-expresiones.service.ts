import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContaTipoValorExpresionesEntity } from './conta-tipovalor-expresiones.entity';

@Injectable()
export class ContaTipovalorExpresionesService {
  constructor(@InjectRepository(ContaTipoValorExpresionesEntity) private readonly tipoValorExpresionesRepos: Repository<ContaTipoValorExpresionesEntity>) {}

  async getAllContaTipoValorExpresiones(): Promise<ContaTipoValorExpresionesEntity[]> {
    try {
      return new Promise<ContaTipoValorExpresionesEntity[]>((resolve, reject) => {
        this.tipoValorExpresionesRepos
          .find()
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err.message || err);
          });
      });
    } catch (err: any) {
      return Promise.reject(err.message || err);
    }
  }
}
