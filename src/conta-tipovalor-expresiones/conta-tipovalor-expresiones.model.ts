import { Field, ObjectType } from '@nestjs/graphql';
import { ContaTipoValorExpresionesEntity } from './conta-tipovalor-expresiones.entity';

@ObjectType()
export class ContaTipoValorExpresionesQueryResponse {
    @Field()
    success: Boolean;

    @Field(() => [ContaTipoValorExpresionesEntity], { nullable: true })
    data?: ContaTipoValorExpresionesEntity[];

    @Field(() => String, { nullable: true })
    error?: String;
}