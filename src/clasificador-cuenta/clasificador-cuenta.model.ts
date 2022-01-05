import { ClasificadorCuentaReal } from './clasificador-cuenta.entity';
import { Field, ObjectType, InputType } from '@nestjs/graphql';

@ObjectType()
export class ClasificadorCuentasQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => [ClasificadorCuentaReal], { nullable: true })
    data?: ClasificadorCuentaReal[];

    @Field(type => String, { nullable: true })
    error?: string;
}

@ObjectType()
export class ClasificadorCuentaQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => ClasificadorCuentaReal, { nullable: true })
    data?: ClasificadorCuentaReal;

    @Field(type => String, { nullable: true })
    error?: string;
}

@ObjectType()
export class VClasificadorCuentaReal {
    @Field()
    Cuenta: string;

    @Field()
    SubCuenta: string;

    @Field()
    Descripcion: string;

    @Field()
    Naturaleza: string;

    @Field({ nullable: true })
    Crit1: string;

    @Field({ nullable: true })
    Crit2: string;

    @Field({ nullable: true })
    Crit3: string;

    @Field()
    Obligacion: string;

    @Field()
    TipoClasificador: number;

    @Field({ nullable: true })
    SeUtiliza: string;

    @Field()
    Terminal: string;

    @Field({ nullable: true })
    Crit1Consolidacion: string;

    @Field({ nullable: true })
    Crit2Consolidacion: string;

    @Field({ nullable: true })
    Crit3Consolidacion: string;
}

@InputType()
export class ClasificadorCuentaRealInput {
    @Field()
    Cuenta: string;

    @Field()
    SubCuenta: string;

    @Field()
    Descripcion: string;

    @Field()
    Naturaleza: string;

    @Field()
    Crit1: string;

    @Field()
    Crit2: string;

    @Field()
    Crit3: string;

    @Field()
    Obligacion: boolean;

    @Field()
    TipoClasificador: number;

    @Field()
    SeUtiliza: string;

    @Field()
    Terminal: boolean;

    @Field()
    Crit1Consolidacion: string;

    @Field()
    Crit2Consolidacion: string;

    @Field()
    Crit3Consolidacion: string;
}

@ObjectType()
export class VClasificadorCuentasQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => [VClasificadorCuentaReal], { nullable: true })
    data?: VClasificadorCuentaReal[];

    @Field(type => String, { nullable: true })
    error?: string;
}

@ObjectType()
export class CuentasAgrupadas {
    @Field()
    Cuenta: string;
}

@ObjectType()
export class CuentasAgrupadasQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => [CuentasAgrupadas], { nullable: true })
    data?: CuentasAgrupadas[];

    @Field(type => String, { nullable: true })
    error?: string;
}

export enum ETipoClasificadorCuenta {
    Consolidado = 1,
    Centro = 2,
    Complejo = 3
}