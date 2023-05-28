import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ConciliaInternaConta {
  @Field({ name: 'Division' })
  division: string;

  @Field({ name: 'Annio' })
  annio: string;

  @Field({ name: 'Periodo' })
  periodo: string;

  @Field({ name: 'Tipo' })
  tipo: string;

  @Field({ name: 'Emisor' })
  emisor: string;

  @Field({ name: 'Receptor' })
  receptor: string;

  @Field({ name: 'CuentaE' })
  cuenta_e: string;

  @Field({ name: 'SubCuentaE' })
  subcuenta_e: string;

  @Field({ name: 'ValorE' })
  valor_e: number;

  @Field({ name: 'Operador' })
  operador: string;

  @Field({ name: 'CuentaR' })
  cuenta_r: string;

  @Field({ name: 'SubCuentaR' })
  subcuenta_r: string;

  @Field({ name: 'ValorR' })
  valor_r: number;

  @Field({ name: 'Diferencia' })
  diferencia: number;
}
