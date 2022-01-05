import { ContaExpresionesResumen, ContaExpresionesDetalle } from './conta-expresiones.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ContaExpresionResumenQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => ContaExpresionesResumen, { nullable: true })
    data?: ContaExpresionesResumen;

    @Field(type => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class ContaExpresionDetalleQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => ContaExpresionesDetalle, { nullable: true })
    data?: ContaExpresionesDetalle;

    @Field(type => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class ContaExpresionesResumenQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => [ContaExpresionesResumen], { nullable: true })
    data?: ContaExpresionesResumen[];

    @Field(type => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class ContaExpresionesDetalleQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => [ContaExpresionesDetalle], { nullable: true })
    data?: ContaExpresionesDetalle[];

    @Field(type => String, { nullable: true })
    error?: String;
}

@InputType()
export class ContaExpresionResumenInput {
    @Field({ nullable: true })
    IdExpresion: number;

    @Field()
    Expresion: string;

    @Field({ nullable: true })
    Descripcion: string;

    @Field()
    Acumulado: boolean;

    @Field()
    OperacionesInternas: boolean;

    @Field({ nullable: true})
    Centralizada?: boolean;
}

@InputType()
export class ContaExpresionDetalleInput {
    @Field({ nullable: true })
    id: number;

    @Field()
    IdExpresion: number;

    @Field({ nullable: true })
    Centro: string;

    @Field({ nullable: true })
    Cta: string;

    @Field({ nullable: true })
    SubCta: string;

    @Field({ nullable: true })
    Crit1: string;

    @Field({ nullable: true })
    Crit2: string;

    @Field({ nullable: true })
    Crit3: string;

    @Field()
    Signo: string;

    @Field()
    PorCiento: number;

    @Field()
    TipoValor: number;
}

@InputType()
export class ContaExpresionInput {
    @Field(type => ContaExpresionResumenInput)
    ExpresionResumen: ContaExpresionResumenInput;

    @Field(type => [ContaExpresionDetalleInput])
    ExpresionesDetalle: ContaExpresionDetalleInput[];
}
