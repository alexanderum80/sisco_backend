import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VConciliaExternaDWH {
  @Field()
  Id: number;

  @Field()
  Annio: string;

  @Field()
  Mes: number;

  @Field()
  Emisor: number;

  @Field()
  FechaEmision: Date;

  @Field()
  Receptor: number;

  @Field()
  FechaRecepcion: Date;

  @Field()
  Documento: string;

  @Field()
  ImpEmisor: number;

  @Field()
  ImpReceptor: number;

  @Field()
  Diferencia: number;

  @Field()
  DiferenciaDias: number;

  @Field()
  Recibido: boolean;
}

@ObjectType()
export class VDifCantidadRecepcion {
  @Field()
  IdDivision: number;

  @Field()
  Division: string;

  @Field()
  IdUnidad: number;

  @Field()
  Unidad: string;

  @Field()
  Fecha: Date;

  @Field()
  DocumentoR: string;

  @Field()
  IdCuentaFinanciera: number;

  @Field()
  DocumentoF: string;

  @Field()
  Codigo: string;

  @Field()
  Descripcion: string;

  @Field()
  CantidadR: number;

  @Field()
  CantidadF: number;

  @Field()
  DifCantidad: number;

  @Field()
  PCostoR: number;

  @Field()
  PCostoF: number;

  @Field()
  DifPCosto: number;

  @Field()
  ImporteR: number;

  @Field()
  ImporteF: number;

  @Field()
  DifImporte: number;

  @Field()
  Afectacion: number;
}
