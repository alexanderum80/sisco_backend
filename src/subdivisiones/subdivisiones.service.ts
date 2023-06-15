import { SubdivisionesEntity } from './subdivisiones.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SubdivisionesService {
  constructor(@InjectRepository(SubdivisionesEntity) private readonly subdivisionesRepository: Repository<SubdivisionesEntity>) {}

  async findAll(): Promise<SubdivisionesEntity[]> {
    try {
      return new Promise<SubdivisionesEntity[]>((resolve, reject) => {
        this.subdivisionesRepository
          .find({ order: { IdSubdivision: 'ASC' } })
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

  async findAllByIdDivision(idDivision: number): Promise<SubdivisionesEntity[]> {
    try {
      return new Promise<SubdivisionesEntity[]>((resolve, reject) => {
        this.subdivisionesRepository
          .find({ where: [{ IdDivision: idDivision }], order: { IdSubdivision: 'ASC' } })
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
