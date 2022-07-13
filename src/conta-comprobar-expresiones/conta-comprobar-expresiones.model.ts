import { MultipleQueryResponse, SingleQueryResponse } from '../shared/models/query.response.model';
import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { ContaComprobarExpresionesEntity } from './conta-comprobar-expresiones.entity';

@ObjectType()
export class ContaComprobarExpresionesQueryResponse extends MultipleQueryResponse(ContaComprobarExpresionesEntity) {}

@ObjectType()
export class ContaComprobarExpresionQueryResponse extends SingleQueryResponse(ContaComprobarExpresionesEntity) {}

@InputType()
export class ContaComprobarExpresionesInput {
    @Field()
    Id?: number;

    @Field()
    IdExpresion: number;

    @Field()
    IdOperador: string;

    @Field()
    IdExpresionC: number;

    @Field()
    Centro: boolean;

    @Field()
    Complejo: boolean;

    @Field()
    Con: boolean;

    @Field()
    Centralizada: boolean;

    @Field()
    IdDivision: number;
}
