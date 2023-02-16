import { MultipleQueryResponse, SingleQueryResponse } from './../shared/models/query.response.model';
import { ClasificadorCuentaRealEntity } from './clasificador-cuenta.entity';
import { Field, ObjectType, InputType } from '@nestjs/graphql';

@ObjectType()
export class ClasificadorCuentaQueryResponse extends SingleQueryResponse(ClasificadorCuentaRealEntity) {}

@ObjectType()
export class ClasificadorCuentasQueryResponse extends MultipleQueryResponse(ClasificadorCuentaRealEntity) {}

@InputType()
export class ClasificadorCuentaRealInput {
  @Field()
  TipoClasificador: number;

  @Field()
  Cuenta: string;

  @Field()
  SubCuenta: string;

  @Field()
  Nombre: string;

  @Field()
  Naturaleza: string;

  @Field({ nullable: true })
  Tipo_Analisis_1?: string;

  @Field({ nullable: true })
  Tipo_Analisis_2?: string;

  @Field({ nullable: true })
  Tipo_Analisis_3?: string;

  @Field({ nullable: true })
  Tipo_Analisis_4?: string;

  @Field({ nullable: true })
  Tipo_Analisis_5?: string;

  @Field({ defaultValue: false })
  Obligacion: boolean;

  @Field({ nullable: true })
  Tipo_Moneda?: string;

  @Field()
  Grupo?: string;

  @Field()
  Clase?: string;

  @Field()
  Categoria?: string;

  @Field()
  Clasificacion?: string;

  @Field()
  Tipo?: string;

  @Field()
  Estado?: string;

  @Field({ nullable: true })
  Tipo_Analisis_1_Cons?: string;

  @Field({ nullable: true })
  Tipo_Analisis_2_Cons?: string;

  @Field({ nullable: true })
  Tipo_Analisis_3_Cons?: string;

  @Field({ nullable: true })
  Tipo_Analisis_4_Cons?: string;

  @Field({ nullable: true })
  Tipo_Analisis_5_Cons?: string;

  @Field({ nullable: true })
  SeUtiliza?: string;
}

@ObjectType()
export class CuentasAgrupadas {
  @Field()
  Cuenta: string;
}

@ObjectType()
export class CuentasAgrupadasQueryResponse extends MultipleQueryResponse(CuentasAgrupadas) {}

export enum ETipoClasificadorCuenta {
  Consolidado = 1,
  Centro = 2,
  Complejo = 3,
}
