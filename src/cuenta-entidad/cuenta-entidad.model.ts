import { ContaCuentaentidad } from './cuenta-entidad.entity';
import { Field, ObjectType, InputType } from '@nestjs/graphql';

@ObjectType()
export class CuentasEntidadQueryResponse {
    @Field()
    success: Boolean;

    @Field(() => [ContaCuentaentidad], { nullable: true })
    data?: ContaCuentaentidad[];

    @Field(() => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class CuentaEntidadQueryResponse {
    @Field()
    success: Boolean;

    @Field(() => ContaCuentaentidad, { nullable: true })
    data?: ContaCuentaentidad;

    @Field(() => String, { nullable: true })
    error?: String;
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