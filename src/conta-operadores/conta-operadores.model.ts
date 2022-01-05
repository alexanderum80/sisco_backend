import { ContaOperadoresEntity } from './conta-operadores.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ContaOperadoresQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => [ContaOperadoresEntity], { nullable: true })
    data?: ContaOperadoresEntity[];

    @Field(type => String, { nullable: true })
    error?: String;
}