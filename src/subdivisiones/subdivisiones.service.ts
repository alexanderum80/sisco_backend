import { SubdivisionesQueryResponse } from './subdivisiones.model';
import { Subdivisiones } from './subdivisiones.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SubdivisionesService {
    constructor(@InjectRepository(Subdivisiones) private readonly subdivisionesRepository: Repository<Subdivisiones>) {}

    async findAll(): Promise<SubdivisionesQueryResponse> {
        try {
            return new Promise<SubdivisionesQueryResponse>(resolve => {
                this.subdivisionesRepository
                    .find()
                    .then(result => {
                        resolve({
                            success: true,
                            data: result,
                        });
                    })
                    .catch(err => {
                        return { success: false, error: err.message ? err.message : err };
                    });
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }

    async findAllByIdDivision(idDivision: number): Promise<SubdivisionesQueryResponse> {
        try {
            return new Promise<SubdivisionesQueryResponse>(resolve => {
                this.subdivisionesRepository
                    .find({ where: [{ IdDivision: idDivision }] })
                    .then(result => {
                        resolve({
                            success: true,
                            data: result,
                        });
                    })
                    .catch(err => {
                        return { success: false, error: err.message ? err.message : err };
                    });
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }
}
