import { ExpresionesResumenEntity } from './../conta-expresiones/conta-expresiones.entity';
import { ContaOperadoresEntity as OperadoresEntity } from './../conta-operadores/conta-operadores.entity';
import { CentrosView } from './../unidades/unidades.entity';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { UsuariosEntity } from './../usuarios/usuarios.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ComprobarValoresEntity } from './conta-comprobar-valores.entity';
import { Repository } from 'typeorm';
import { ComprobarValoresInput } from './conta-comprobar-valores.model';

@Injectable()
export class ContaComprobarValoresService {
  constructor(@InjectRepository(ComprobarValoresEntity) private readonly comprobarValoresEntity: Repository<ComprobarValoresEntity>) {}

  async findAll(user: UsuariosEntity): Promise<ComprobarValoresEntity[]> {
    try {
      const { IdDivision } = user;

      return new Promise<ComprobarValoresEntity[]>((resolve, reject) => {
        this.comprobarValoresEntity
          .createQueryBuilder('v')
          .select('v.Id', 'Id')
          .addSelect('v.IdCentro', 'IdCentro')
          .addSelect('v.IdExpresion', 'IdExpresion')
          .addSelect('v.IdOperador', 'IdOperador')
          .addSelect('v.Valor', 'Valor')
          .addSelect('v.Consolidado', 'Consolidado')
          .addSelect('v.Activo', 'Activo')
          .addSelect('c.Nombre', 'Centro')
          .addSelect('e.Expresion', 'Expresion')
          .addSelect('o.Operador', 'Operador')
          .innerJoin(CentrosView, 'c', 'c.IdUnidad = v.IdCentro')
          .innerJoin(ExpresionesResumenEntity, 'e', 'e.IdExpresion = v.IdExpresion')
          .innerJoin(OperadoresEntity, 'o', 'o.Id = v.IdOperador')
          .where('v.IdDivision = :idDivision', { idDivision: IdDivision })
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

  async findOne(id: number): Promise<ComprobarValoresEntity> {
    try {
      return new Promise<ComprobarValoresEntity>((resolve, reject) => {
        this.comprobarValoresEntity
          .findOne({ where: [{ Id: id }] })
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

  async create(user: UsuariosEntity, comprobarValoresInput: ComprobarValoresInput): Promise<MutationResponse> {
    try {
      const { IdDivision } = user;

      delete comprobarValoresInput.Id;

      comprobarValoresInput.IdDivision = IdDivision;

      return new Promise<MutationResponse>(resolve => {
        this.comprobarValoresEntity
          .save(comprobarValoresInput)
          .then(() => {
            resolve({ success: true });
          })
          .catch(err => {
            resolve({ success: false, error: err.message ? err.message : err });
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async update(contaComprobarValoresInput: ComprobarValoresInput): Promise<MutationResponse> {
    try {
      return new Promise<MutationResponse>(resolve => {
        this.comprobarValoresEntity
          .save(contaComprobarValoresInput)
          .then(() => {
            resolve({ success: true });
          })
          .catch(err => {
            resolve({ success: false, error: err.message ? err.message : err });
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async delete(IDs: number[]) {
    try {
      return new Promise<MutationResponse>(resolve => {
        this.comprobarValoresEntity
          .delete(IDs)
          .then(() => {
            resolve({ success: true });
          })
          .catch(err => {
            resolve({ success: false, error: err.message ? err.message : err });
          });
      });
    } catch (err: any) {
      return { success: false, error: err.message ? err.message : err };
    }
  }
}
