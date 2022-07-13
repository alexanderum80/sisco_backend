import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { ContaElementosGastos } from './elementos-gastos.entity';

@ObjectType()
export class ElementosGastosQueryResponse {
    @Field()
    success: Boolean;

    @Field(() => [ContaElementosGastos], { nullable: true })
    data?: ContaElementosGastos[];

    @Field(() => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class ElementoGastoQueryResponse {
    @Field()
    success: Boolean;

    @Field(() => ContaElementosGastos, { nullable: true })
    data?: ContaElementosGastos;

    @Field(() => String, { nullable: true })
    error?: String;
}

@InputType()
export class ElementoGastoInput {
    @Field()
    Egasto: string;

    @Field()
    Descripcion: string;

    @Field()
    UsoContenido: string;

    @Field()
    TipoEntidad: string;

    @Field()
    CuentaAsociada: string;

    @Field()
    IdEpigrafe: number;
}

