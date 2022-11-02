import { ContaCuentaentidad } from './cuenta-entidad.entity';
import { Field, ObjectType, InputType } from '@nestjs/graphql';

@ObjectType()
export class CuentasEntidadQueryResponse {
  @Field()
  success: boolean;

  @Field(() => [ContaCuentaentidad], { nullable: true })
  data?: ContaCuentaentidad[];

  @Field(() => String, { nullable: true })
  error?: string;
}

@ObjectType()
export class CuentaEntidadQueryResponse {
  @Field()
  success: boolean;

  @Field(() => ContaCuentaentidad, { nullable: true })
  data?: ContaCuentaentidad;

  @Field(() => String, { nullable: true })
  error?: string;
}

@InputType()
export class ContaCuentaEntidadInput {
  @Field()
  Cuenta: string;

  @Field()
  SubCuenta: string;

  @Field()
  TipoEntidad: number;

  @Field()
  TipoClasificador: number;
}
