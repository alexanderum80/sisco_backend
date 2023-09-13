import { PrimaryColumn, ViewColumn, ViewEntity } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ContaEstadisticaView {
  @Field(() => Int)
  IdDivision: number;

  @Field()
  Division: string;

  @Field(() => Int)
  IdCentro: number;

  @Field()
  Centro: string;

  @Field(() => Boolean)
  Consolidado: boolean;

  @Field(() => Int)
  Annio: number;

  @Field(() => Int)
  Periodo: number;

  @Field(() => Date, { nullable: true })
  FechaActualizacion?: Date;

  @Field(() => Date, { nullable: true })
  FechaInicio?: Date;

  @Field(() => Date, { nullable: true })
  FechaFin?: Date;

  @Field(() => Int)
  Comprobantes: number;

  @Field(() => Int)
  Traspasados: number;

  @Field(() => Int)
  SinTraspasar: number;

  @Field(() => Int)
  Inconclusos: number;

  @Field(() => Int)
  Anulados: number;
}

@ObjectType()
@ViewEntity('v_conta_estadistica')
export class ContaEstadisticaParteView {
  @Field()
  @ViewColumn({ name: 'id_division' })
  IdDivision: number;

  @Field()
  @ViewColumn({ name: 'division' })
  Division: string;

  @Field()
  @ViewColumn({ name: 'id_centro' })
  @PrimaryColumn({ name: 'id_centro' })
  IdCentro: number;

  @Field()
  @ViewColumn({ name: 'centro' })
  Centro: string;

  @Field(() => Boolean)
  @ViewColumn({ name: 'consolidado' })
  @PrimaryColumn({ name: 'consolidado' })
  Consolidado: boolean;

  @Field(() => Int)
  @ViewColumn({ name: 'anno' })
  Anno: number;

  @Field(() => Int)
  @ViewColumn({ name: 'periodo' })
  Periodo: number;

  @Field(() => Date, { nullable: true })
  @ViewColumn({ name: 'fecha_actualizacion' })
  FechaActualizacion?: Date;

  @Field(() => Date, { nullable: true })
  @ViewColumn({ name: 'fecha_inicio' })
  FechaInicio?: Date;

  @Field(() => Date, { nullable: true })
  @ViewColumn({ name: 'fecha_fin' })
  FechaFin?: Date;

  @Field(() => Int)
  @ViewColumn({ name: 'comprobantes' })
  Comprobantes: number;

  @Field(() => Int)
  @ViewColumn({ name: 'traspasados' })
  Traspasados: number;

  @Field(() => Int)
  @ViewColumn({ name: 'sin_traspasar' })
  SinTraspasar: number;

  @Field(() => Int)
  @ViewColumn({ name: 'inconclusos' })
  Inconclusos: number;

  @Field(() => Int)
  @ViewColumn({ name: 'anulados' })
  Anulados: number;

  @Field()
  @ViewColumn({ name: 'conexion' })
  Conexion: string;
}
