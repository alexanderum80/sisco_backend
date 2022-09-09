import { ActFijosClasificadorCnmbEntity } from './actfijos-clasificador-cnmb.entity';
import { ActFijosClasificadorCnmbInput } from './actfijos-clasificador-cnmb.input';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ActfijosClasificadorCnmbService {
    constructor(@InjectRepository(ActFijosClasificadorCnmbEntity) private readonly aftClasificadorRepo: Repository<ActFijosClasificadorCnmbEntity>) {}

    async findAll(): Promise<ActFijosClasificadorCnmbEntity[]> {
        try {
            return new Promise<ActFijosClasificadorCnmbEntity[]>((resolve, reject) => {
                this.aftClasificadorRepo
                    .find()
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err.message || err);
                    });
            });
        } catch (err) {
            return Promise.reject(err.message || err);
        }
    }

    async findOne(cnmb: string): Promise<ActFijosClasificadorCnmbEntity> {
        try {
            return new Promise<ActFijosClasificadorCnmbEntity>((resolve, reject) => {
                this.aftClasificadorRepo
                    .findOne({ where: [{ CNMB: cnmb }] })
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err.message || err);
                    });
            });
        } catch (err) {
            return Promise.reject(err.message || err);
        }
    }

    async save(actfijosClasificadorCnmbInput: ActFijosClasificadorCnmbInput): Promise<ActFijosClasificadorCnmbEntity> {
        try {
            return new Promise<ActFijosClasificadorCnmbEntity>((resolve, reject) => {
                this.aftClasificadorRepo
                    .save(actfijosClasificadorCnmbInput)
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err.message || err);
                    });
            });
        } catch (err) {
            return Promise.reject(err.message || err);
        }
    }

    async remove(cnmb: string): Promise<number> {
        try {
            return new Promise<number>((resolve, reject) => {
                this.aftClasificadorRepo
                    .delete(cnmb)
                    .then(res => {
                        resolve(res.affected);
                    })
                    .catch(err => {
                        reject(err.message || err);
                    });
            });
        } catch (err) {
            return Promise.reject(err.message || err);
        }
    }
}
