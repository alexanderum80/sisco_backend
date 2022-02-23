import { ExpresionesResumenEntity } from './../conta-expresiones/conta-expresiones.entity';
import { ContaOperadoresEntity as OperadoresEntity } from './../conta-operadores/conta-operadores.entity';
import { CentrosView } from './../unidades/unidades.entity';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { Usuarios } from './../usuarios/usuarios.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ComprobarValoresEntity } from './conta-comprobar-valores.entity';
import { Repository } from 'typeorm';
import { ComprobarValoresInput, ComprobarValoresQueryResponse, ComprobarValorQueryResponse } from './conta-comprobar-valores.model';

@Injectable()
export class ContaComprobarValoresService {
  constructor(
    @InjectRepository(ComprobarValoresEntity) private readonly comprobarValoresEntity: Repository<ComprobarValoresEntity> 
  ) {}

  async findAll(user: Usuarios): Promise<ComprobarValoresQueryResponse> {
    try {
      const { IdDivision } = user;

      return new Promise<ComprobarValoresQueryResponse>(resolve => {
        this.comprobarValoresEntity.createQueryBuilder('v')
          .select('v.Id', 'Id')
          .addSelect('v.IdCentro', 'IdCentro')
          .addSelect('v.IdExpresion', 'IdExpresion')
          .addSelect('v.IdOperador', 'IdOperador')
          .addSelect('v.Valor', 'Valor')
          .addSelect('Concat(c.IdUnidad, \'-\', c.Nombre)', 'Centro')
          .addSelect('e.Expresion', 'Expresion')
          .addSelect('o.Operador', 'Operador')
          .innerJoin(CentrosView, 'c', 'c.IdUnidad = v.IdCentro')
          .innerJoin(ExpresionesResumenEntity, 'e', 'e.IdExpresion = v.IdExpresion')
          .innerJoin(OperadoresEntity, 'o', 'o.Id = v.IdOperador')
          .where('v.IdDivision = :idDivision', { idDivision: IdDivision })
        .execute().then(result => {
          resolve({ 
            success: true, 
            data: result 
          })
        }).catch(err => {
          resolve({ success: false, error: err.message ? err.message : err });
        })
      })
    } catch (err) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async findOne(id: number): Promise<ComprobarValorQueryResponse> {
    try {
      return new Promise<ComprobarValorQueryResponse>(resolve => {
        this.comprobarValoresEntity.findOne(id).then(result => {
          resolve({ 
            success: true, 
            data: result 
          })
        }).catch(err => {
          resolve({ success: false, error: err.message ? err.message : err });
        })
      })
    } catch (err) {
      return { success: false, error: err.message ? err.message : err };
    }
  }
  
  async create(user: Usuarios, comprobarValoresInput: ComprobarValoresInput): Promise<MutationResponse> {
    try {
      const { IdDivision } = user;
      
      delete comprobarValoresInput.Id;

      comprobarValoresInput.IdDivision = IdDivision;

      return new Promise<MutationResponse>(resolve => {
        this.comprobarValoresEntity.save(comprobarValoresInput).then(result => {
          resolve({ success: true })
        }).catch(err => {
          resolve({ success: false, error: err.message ? err.message : err });
        })
     })
    } catch (err) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async update(contaComprobarValoresInput: ComprobarValoresInput): Promise<MutationResponse> {
    try {
      return new Promise<MutationResponse>(resolve => {
        this.comprobarValoresEntity.save(contaComprobarValoresInput).then(result => {
          resolve({ success: true })
        }).catch(err => {
          resolve({ success: false, error: err.message ? err.message : err });
        })
     })
    } catch (err) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

  async delete(IDs: number[]) {
    try {
      return new Promise<MutationResponse>(resolve => {
        this.comprobarValoresEntity.delete(IDs).then(result => {
          resolve({ success: true })
        }).catch(err => {
          resolve({ success: false, error: err.message ? err.message : err });
        })
     })
    } catch (err) {
      return { success: false, error: err.message ? err.message : err };
    }
  }

}