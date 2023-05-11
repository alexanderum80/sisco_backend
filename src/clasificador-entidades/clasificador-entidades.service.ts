import { TipoEntidades } from './../tipo-entidades/tipo-entidades.entity';
import { CentrosView } from './../unidades/unidades.entity';
import { MutationResponse } from '../shared/models/mutation.response.model';
import { ClasificarEntidadesEntity } from './clasificador-entidades.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClasificadorEntidadInput } from './clasificador-entidades.model';

@Injectable()
export class ClasificadorEntidadesService {
  constructor(@InjectRepository(ClasificarEntidadesEntity) private readonly clasificarEntidadesRepository: Repository<ClasificarEntidadesEntity>) {}

  async findAll(): Promise<ClasificarEntidadesEntity[]> {
    try {
      return new Promise<ClasificarEntidadesEntity[]>((resolve, reject) => {
        this.clasificarEntidadesRepository
          .createQueryBuilder('clas')
          .select('clas.IdUnidad', 'IdUnidad')
          .addSelect('clas.IdTipoEntidad', 'IdTipoEntidad')
          .addSelect('centros.Nombre', 'Unidad')
          .addSelect('tipo.Entidades', 'TipoEntidad')
          .addSelect('centros.Division', 'Division')
          .addSelect('centros.SubDivision', 'SubDivision')
          .innerJoin(CentrosView, 'centros', 'centros.IdUnidad = clas.IdUnidad')
          .innerJoin(TipoEntidades, 'tipo', 'tipo.Id = clas.IdTipoEntidad')
          .execute()
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

  async findOne(idUnidad: number): Promise<ClasificarEntidadesEntity> {
    try {
      return new Promise<ClasificarEntidadesEntity>((resolve, reject) => {
        this.clasificarEntidadesRepository
          .findOne({ where: [{ IdUnidad: idUnidad }] })
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

  async create(clasificadorEntidadInfo: ClasificadorEntidadInput): Promise<MutationResponse> {
    try {
      const clasif = await this.clasificarEntidadesRepository.findOne({ where: [{ IdUnidad: clasificadorEntidadInfo.IdUnidad }] });

      if (clasif) {
        return { success: false, error: `La Entidad ${clasificadorEntidadInfo.IdUnidad} ya está clasificada. Si lo desea, modifíquela.` };
      }

      return new Promise<MutationResponse>(resolve => {
        this.clasificarEntidadesRepository
          .save(clasificadorEntidadInfo)
          .then(() => {
            resolve({ success: true });
          })
          .catch(err => {
            return { success: false, error: err.message ? err.message : err };
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async update(clasificadorEntidadInfo: ClasificadorEntidadInput): Promise<MutationResponse> {
    try {
      return new Promise<MutationResponse>(resolve => {
        this.clasificarEntidadesRepository
          .save(clasificadorEntidadInfo)
          .then(() => {
            resolve({ success: true });
          })
          .catch(err => {
            return { success: false, error: err.message ? err.message : err };
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async delete(IDs: number[]): Promise<MutationResponse> {
    try {
      return new Promise<MutationResponse>(resolve => {
        this.clasificarEntidadesRepository
          .delete(IDs)
          .then(() => {
            resolve({ success: true });
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
