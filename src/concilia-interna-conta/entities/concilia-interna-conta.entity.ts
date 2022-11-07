import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ConciliaInternaConta {
  @Field()
  Division: string;

  @Field()
  Annio: string;

  @Field()
  Periodo: string;

  @Field()
  CuentaE: string;

  @Field()
  SubCuentaE: string;

  @Field()
  TipoE: string;

  @Field()
  EmisorE: string;

  @Field()
  ReceptorE: string;

  @Field()
  ValorE: number;

  @Field()
  Operador: string;

  @Field()
  CuentaR: string;

  @Field()
  SubCuentaR: string;

  @Field()
  TipoR: string;

  @Field()
  EmisorR: string;

  @Field()
  ReceptorR: string;

  @Field()
  ValorR: number;

  @Field()
  Diferencia: number;
}
