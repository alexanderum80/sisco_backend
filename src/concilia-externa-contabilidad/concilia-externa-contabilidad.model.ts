import { Field, ObjectType } from '@nestjs/graphql';

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
  CuentaEmisor?: string;

  @Field()
  SubCuentaEmisor?: string;

  @Field()
  DivisionEmisor: number;

  @Field()
  Emisor: number;

  @Field()
  CuentaReceptor?: string;

  @Field()
  SubCuentaReceptor?: string;

  @Field()
  DivisionReceptor: number;

  @Field()
  Receptor: number;

  @Field()
  Documento: string;

  @Field({ nullable: true })
  FechaEmision?: string;

  @Field()
  ValorEmisor: number;

  @Field({ nullable: true })
  FechaRecepcion?: string;

  @Field()
  ValorReceptor: number;

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
  Detalle: string;

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

@ObjectType()
export class ConciliaExternaContabilidadEntity {
  @Field(() => [ViewConciliaExtContabilidad])
  getConciliaContab: ViewConciliaExtContabilidad[];

  @Field(() => [ActaConciliacion])
  getActaConciliacion: ActaConciliacion[];
}

@ObjectType()
export class ViewConciliaExtContabilidadResumen {
  @Field()
  Annio: number;

  @Field()
  Mes: number;

  @Field()
  DivisionEmisor: string;

  @Field()
  ValorEmisor: number;

  @Field()
  DivisionReceptor: string;

  @Field()
  ValorReceptor: number;

  @Field()
  Diferencia: number;
}
