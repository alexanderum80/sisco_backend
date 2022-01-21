import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { ContaComprobarExpresionesEntity } from './conta-comprobar-expresiones.entity';

@ObjectType()
export class ContaComprobarExpresionesQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => [ContaComprobarExpresionesEntity], { nullable: true })
    data?: ContaComprobarExpresionesEntity[];

    @Field(type => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class ContaComprobarExpresionQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => ContaComprobarExpresionesEntity, { nullable: true })
    data?: ContaComprobarExpresionesEntity;

    @Field(type => String, { nullable: true })
    error?: String;
}

@InputType()
export class ContaComprobarExpresionesInput {
    @Field()
    Id: number;

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
}
