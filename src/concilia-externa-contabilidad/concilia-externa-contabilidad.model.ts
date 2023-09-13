import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ViewConciliaExtContabilidad {
  @Field({ name: 'Id' })
  id: number;

  @Field({ name: 'Anno' })
  anno: string;

  @Field({ name: 'Mes' })
  mes: number;

  @Field({ name: 'Tipo' })
  tipo: string;

  @Field({ name: 'CuentaEmisor' })
  cuenta_emisor?: string;

  @Field({ name: 'SubCuentaEmisor' })
  subcuenta_emisor?: string;

  @Field({ name: 'DivisionEmisor' })
  division_emisor: number;

  @Field({ name: 'Emisor' })
  emisor: number;

  @Field({ name: 'CuentaReceptor' })
  cuenta_receptor?: string;

  @Field({ name: 'SubCuentaReceptor' })
  subcuenta_receptor?: string;

  @Field({ name: 'DivisionReceptor' })
  division_receptor?: number;

  @Field({ name: 'Receptor' })
  receptor: number;

  @Field({ name: 'Documento' })
  documento: string;

  @Field({ name: 'FechaEmision', nullable: true })
  fecha_emision?: string;

  @Field({ name: 'ValorEmisor' })
  valor_emisor: number;

  @Field({ name: 'FechaRecepcion', nullable: true })
  fecha_recepcion?: string;

  @Field({ name: 'ValorReceptor' })
  valor_receptor: number;

  @Field({ name: 'DiferenciaDias', nullable: true })
  diferencia_dias?: number;

  @Field({ name: 'DiferenciaImporte' })
  diferencia_importe: number;

  @Field({ name: 'Recibido' })
  recibido: boolean;
}

@ObjectType()
export class ActaConciliacion {
  @Field({ name: 'ID' })
  id: number;

  @Field({ name: 'Detalle' })
  detalle: string;

  @Field({ name: 'Emisor' })
  emisor: number;

  @Field({ name: 'Receptor' })
  receptor: number;

  @Field({ name: 'SaldoEmisor' })
  saldo_emisor: number;

  @Field({ name: 'SaldoReceptor' })
  saldo_receptor: number;

  @Field({ name: 'Diferencia' })
  diferencia: number;
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
  @Field({ name: 'Anno' })
  anno: number;

  @Field({ name: 'Mes' })
  mes: number;

  @Field({ name: 'DivisionEmisor' })
  division_emisor: string;

  @Field({ name: 'ValorEmisor' })
  valor_emisor: number;

  @Field({ name: 'DivisionReceptor' })
  division_receptor: string;

  @Field({ name: 'ValorReceptor' })
  valor_receptor: number;

  @Field({ name: 'Diferencia' })
  diferencia: number;
}

@ObjectType()
export class ViewConciliaExtContabilidadDeudasPorEdades {
  @Field({ name: 'TipoOperacion' })
  tipo_operacion: string;

  @Field({ name: 'Anno' })
  anno: number;

  @Field({ name: 'Mes' })
  mes: number;

  @Field({ name: 'IdDivision' })
  id_division: number;

  @Field({ name: 'Division' })
  division: string;

  @Field({ name: 'Valor' })
  valor: number;

  @Field({ name: 'De0a30' })
  de0a30: number;

  @Field({ name: 'De30a60' })
  de30a60: number;

  @Field({ name: 'De60a90' })
  de60a90: number;

  @Field({ name: 'De90a365' })
  de90a365: number;

  @Field({ name: 'MasDe1Anno' })
  mas1anno: number;
}
