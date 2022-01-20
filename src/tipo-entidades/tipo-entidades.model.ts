import { TipoEntidades } from './tipo-entidades.entity';
import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
export class ContaTipoentidadesQueryResponse {
    @Field()
    success: boolean;

    @Field(type => [TipoEntidades], { nullable: true })
    data?: TipoEntidades[];

    @Field({ nullable: true })
    error?: string;
}

@ObjectType()
export class ContaTipoentidadQueryResponse {
    @Field()
    success: boolean;

    @Field(type => TipoEntidades, { nullable: true })
    data?: TipoEntidades;

    @Field({ nullable: true })
    error?: string;
}

@InputType()
export class TipoEntidadInput {
    @Field()
    Id: number;

    @Field()
    Entidades: string;

    @Field()
    Descripcion: string;
}