import { SingleQueryResponse, MultipleQueryResponse } from '../shared/models/query.response.model';
import { ContaExpresionesResumen, ContaExpresionesDetalle } from './conta-expresiones.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ContaExpresionResumenQueryResponse extends SingleQueryResponse(ContaExpresionesResumen) {}

@ObjectType()
export class ContaExpresionDetalleQueryResponse extends SingleQueryResponse(ContaExpresionesDetalle) {}

@ObjectType()
export class ContaExpresionesResumenQueryResponse extends MultipleQueryResponse(ContaExpresionesResumen) {}

@ObjectType()
export class ContaExpresionesDetalleQueryResponse extends MultipleQueryResponse(ContaExpresionesDetalle) {}

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

    @Field()
    Centralizada: boolean;
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
