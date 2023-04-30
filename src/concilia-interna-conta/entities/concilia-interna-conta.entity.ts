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
  Tipo: string;

  @Field()
  Emisor: string;

  @Field()
  Receptor: string;

  @Field()
  CuentaE: string;

  @Field()
  SubCuentaE: string;

  @Field()
  ValorE: number;

  @Field()
  Operador: string;

  @Field()
  CuentaR: string;

  @Field()
  SubCuentaR: string;

  @Field()
  ValorR: number;

  @Field()
  Diferencia: number;
}
