import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { ContaEgastocuenta } from './elementos-gastos-cuenta.entity';

@ObjectType()
export class ElementosGastosCuentaQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => [ContaEgastocuenta], { nullable: true })
    data?: ContaEgastocuenta[];

    @Field(type => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class ElementoGastoCuentaQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => ContaEgastocuenta, { nullable: true })
    data?: ContaEgastocuenta;

    @Field(type => String, { nullable: true })
    error?: String;
}

@InputType()
export class ElementoGastoCuentaInput {
    @Field()
    IdEGasto: string;

    @Field()
    Cuenta: string;
}