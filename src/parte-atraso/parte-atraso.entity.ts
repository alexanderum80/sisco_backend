import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ParteAtrasoEntity {
  @Field()
  IdUnidad: number;

  @Field()
  Unidad: string;

  @Field()
  IdDivision: number;

  @Field()
  Division: string;

  @Field()
  AtrasoRest: number;

  @Field()
  AtrasoDWH: number;

  @Field()
  AtrasoDist: number;

  @Field()
  AtrasoEmp: number;
}

@ObjectType()
export class DatosIdGamEntity {
  @Field()
  IdUnidad: number;

  @Field()
  Unidad: string;

  @Field()
  Ano: number;

  @Field()
  Mes: number;

  @Field()
  Fecha: string;

  @Field()
  Version: string;

  @Field()
  UltimaCircular: string;

  @Field()
  PeriodoRestaurado: string;

  @Field()
  vUtilnet: string;
}
