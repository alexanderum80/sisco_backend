import { ContaNoUsarEnCuentaEntity } from './conta-no-usar-en-cuenta.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ContaNoUsarEnCuentasQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => [ContaNoUsarEnCuentaEntity], { nullable: true })
    data?: ContaNoUsarEnCuentaEntity[];

    @Field(type => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class ContaNoUsarEnCuentaQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => ContaNoUsarEnCuentaEntity, { nullable: true })
    data?: ContaNoUsarEnCuentaEntity;

    @Field(type => String, { nullable: true })
    error?: String;
}

@InputType()
export class ContaNoUsarEnCuentaInput {
    @Field()
    Id: number;

    @Field({ nullable: true })
    Codigo: string;

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

    @Field({ nullable: true })
    TextoInicio?: string;
}