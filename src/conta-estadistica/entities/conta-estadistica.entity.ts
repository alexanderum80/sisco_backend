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
  Invalidos: number;
}
