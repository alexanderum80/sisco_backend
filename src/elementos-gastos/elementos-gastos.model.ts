import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { ContaElementosGastos } from './elementos-gastos.entity';

@ObjectType()
export class ElementosGastosQueryResponse {
  @Field()
  success: boolean;

  @Field(() => [ContaElementosGastos], { nullable: true })
  data?: ContaElementosGastos[];

  @Field(() => String, { nullable: true })
  error?: string;
}

@ObjectType()
export class ElementoGastoQueryResponse {
  @Field()
  success: boolean;

  @Field(() => ContaElementosGastos, { nullable: true })
  data?: ContaElementosGastos;

  @Field(() => String, { nullable: true })
  error?: string;
}

@InputType()
export class ElementoGastoInput {
  @Field()
  Egasto: string;

  @Field()
  Descripcion: string;

  @Field()
  UsoContenido: string;

  @Field()
  TipoEntidad: string;

  @Field()
  CuentaAsociada: string;

  @Field()
  IdEpigrafe: number;
}
