import { UsuariosEntity } from './../usuarios/usuarios.entity';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { ExpresionesResumenEntity, ExpresionesDetalleEntity } from './conta-expresiones.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContaExpresionResumenInput, ContaExpresionDetalleInput, ContaExpresionInput } from './conta-expresiones.model';
import { differenceBy } from 'lodash';
import { ETipoUsuarios } from './../usuarios/usuarios.model';

@Injectable()
export class ContaExpresionesService {
  constructor(
    @InjectRepository(ExpresionesResumenEntity) private readonly contaExpresionesResumenRepository: Repository<ExpresionesResumenEntity>,
    @InjectRepository(ExpresionesDetalleEntity) private readonly contaExpresionDetalleRepository: Repository<ExpresionesDetalleEntity>,
  ) {}

  async create(user: UsuariosEntity, expresionInput: ContaExpresionInput): Promise<MutationResponse> {
    try {
      const { ExpresionResumen, ExpresionesDetalle } = expresionInput;
      delete ExpresionResumen.IdExpresion;

      const { IdDivision, IdTipoUsuario } = user;
      ExpresionResumen.Centralizada = IdDivision === 100 && IdTipoUsuario === ETipoUsuarios['Usuario Avanzado'];

      return new Promise<MutationResponse>(async resolve => {
        const saveExpresionResumen = await this.createResumen(ExpresionResumen).catch(err => {
          throw new Error(err);
        });

        ExpresionesDetalle.forEach(expr => {
          expr.IdExpresion = saveExpresionResumen.IdExpresion;
          this.createDetalle(expr).catch(err => {
            throw new Error(err);
          });
        });

        resolve({ success: true });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async update(expresionInput: ContaExpresionInput): Promise<MutationResponse> {
    try {
      const { ExpresionResumen, ExpresionesDetalle } = expresionInput;

      return new Promise<MutationResponse>(async resolve => {
        const saveExpresionResumen = await this.updateResumen(ExpresionResumen).catch(err => {
          throw new Error(err);
        });

        const originalExpresionDetalle = await this.findOneDetalleByResumen(saveExpresionResumen.IdExpresion).catch(err => {
          throw new Error(err);
        });

        const borrarExpresionDetalle = differenceBy(originalExpresionDetalle, ExpresionesDetalle, 'Id');

        if (borrarExpresionDetalle.length) {
          const IDs = borrarExpresionDetalle.map((e: ContaExpresionDetalleInput) => e.Id);

          await this.deleteDetalle(IDs).catch(err => {
            throw new Error(err);
          });
        }

        ExpresionesDetalle.forEach(expr => {
          expr.IdExpresion = saveExpresionResumen.IdExpresion;
          this.updateDetalle(expr).catch(err => {
            throw new Error(err);
          });
        });

        resolve({ success: true });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  // Expresiones Resumen
  async findAllResumen(user: UsuariosEntity): Promise<ExpresionesResumenEntity[]> {
    try {
      const { IdDivision } = user;

      const criteria = [{ IdDivision: IdDivision }, { Centralizada: true }];

      return new Promise<ExpresionesResumenEntity[]>((resolve, reject) => {
        this.contaExpresionesResumenRepository
          .find({ where: criteria })
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

  async findOneResumen(idExpresion: number): Promise<ExpresionesResumenEntity> {
    try {
      return new Promise<ExpresionesResumenEntity>((resolve, reject) => {
        this.contaExpresionesResumenRepository
          .findOne({ where: [{ IdExpresion: idExpresion }] })
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

  async createResumen(ExpresionesResumenInput: ContaExpresionResumenInput): Promise<ExpresionesResumenEntity> {
    return new Promise<ExpresionesResumenEntity>((resolve, reject) => {
      this.contaExpresionesResumenRepository
        .save(ExpresionesResumenInput)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err.message ? err.message : err);
        });
    });
  }

  async updateResumen(ExpresionesResumenInput: ContaExpresionResumenInput): Promise<ExpresionesResumenEntity> {
    try {
      return new Promise<ExpresionesResumenEntity>((resolve, reject) => {
        this.contaExpresionesResumenRepository
          .save(ExpresionesResumenInput)
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err.message ? err.message : err);
          });
      });
    } catch (err: any) {
      return Promise.reject(err.message || err);
    }
  }

  async deleteResumen(IDs: number[]): Promise<MutationResponse> {
    try {
      return new Promise<MutationResponse>(resolve => {
        this.contaExpresionesResumenRepository
          .delete(IDs)
          .then(() => {
            resolve({ success: true });
          })
          .catch(err => {
            throw new Error(err.message || err);
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  // Expresiones Detalle
  async findAllDetalle(): Promise<ExpresionesDetalleEntity[]> {
    try {
      return new Promise<ExpresionesDetalleEntity[]>((resolve, reject) => {
        this.contaExpresionDetalleRepository
          .find()
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err.message ? err.message : err);
          });
      });
    } catch (err: any) {
      return Promise.reject(err.message || err);
    }
  }

  async findOneDetalleByResumen(idExpresion: number): Promise<ExpresionesDetalleEntity[]> {
    try {
      return new Promise<ExpresionesDetalleEntity[]>((resolve, reject) => {
        this.contaExpresionDetalleRepository
          .find({ where: [{ IdExpresion: idExpresion }] })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err.message ? err.message : err);
          });
      });
    } catch (err: any) {
      return Promise.reject(err.message || err);
    }
  }

  async findOneDetalle(idExpresion: number): Promise<ExpresionesDetalleEntity> {
    try {
      return new Promise<ExpresionesDetalleEntity>((resolve, reject) => {
        this.contaExpresionDetalleRepository
          .findOne({ where: [{ IdExpresion: idExpresion }] })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err.message ? err.message : err);
          });
      });
    } catch (err: any) {
      return Promise.reject(err.message || err);
    }
  }

  async createDetalle(expresionDetalleInput: ContaExpresionDetalleInput): Promise<MutationResponse> {
    try {
      delete expresionDetalleInput.Id;

      return new Promise<MutationResponse>(resolve => {
        this.contaExpresionDetalleRepository
          .save(expresionDetalleInput)
          .then(() => {
            resolve({ success: true });
          })
          .catch(err => {
            throw new Error(err.message || err);
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async updateDetalle(expresionDetalleInput: ContaExpresionDetalleInput): Promise<MutationResponse> {
    try {
      return new Promise<MutationResponse>(resolve => {
        this.contaExpresionDetalleRepository
          .save(expresionDetalleInput)
          .then(() => {
            resolve({ success: true });
          })
          .catch(err => {
            throw new Error(err.message || err);
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async deleteDetalle(idExpresion: number[]): Promise<MutationResponse> {
    try {
      return new Promise<MutationResponse>(resolve => {
        this.contaExpresionDetalleRepository
          .delete(idExpresion)
          .then(() => {
            resolve({ success: true });
          })
          .catch(err => {
            throw new Error(err.message || err);
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }
}
