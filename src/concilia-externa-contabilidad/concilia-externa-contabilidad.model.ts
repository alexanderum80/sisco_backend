import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ViewConciliaExtContabilidad {
  @Field()
  Id: number;

  @Field()
  Annio: string;

  @Field()
  Mes: number;

  @Field()
  Tipo: string;

  @Field()
  CuentaE: string;

  @Field()
  SubCuentaE: string;

  @Field()
  DivisionEmisorE: number;

  @Field()
  Emisor: number;

  @Field()
  DivisionReceptorE: number;

  @Field()
  EmitidoA: number;

  @Field()
  DocumentoE: string;

  @Field()
  FechaE: Date;

  @Field()
  ValorE: number;

  @Field()
  CuentaR: string;

  @Field()
  SubCuentaR: string;

  @Field()
  DivisionReceptorR: number;

  @Field()
  Receptor: number;

  @Field()
  DivisionEmisorR: number;

  @Field()
  RecibidoDe: number;

  @Field()
  DocumentoR: string;

  @Field()
  FechaR: Date;

  @Field()
  ValorR: number;

  @Field()
  DiferenciaDias: number;

  @Field()
  DiferenciaImporte: number;

  @Field()
  Recibido: boolean;
}

@ObjectType()
export class ActaConciliacion {
  @Field()
  ID: number;

  @Field()
  Detalle: number;

  @Field()
  Emisor: number;

  @Field()
  Receptor: number;

  @Field()
  SaldoEmisor: number;

  @Field()
  SaldoReceptor: number;

  @Field()
  Diferencia: number;
}

@InputType()
export class ConciliaExtContabilidadInput {
  @Field()
  Id: number;

  @Field()
  Recibido: boolean;
}
