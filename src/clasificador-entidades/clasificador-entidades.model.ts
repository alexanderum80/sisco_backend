import { ContaClasificarunidades } from './clasificador-entidades.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VClasificadorEntidades {
    @Field()
    IdUnidad: number;

    @Field()
    Unidad: string;

    @Field()
    IdTipoEntidad: number;

    @Field()
    TipoEntidad: string;
}

@ObjectType()
export class VClasificadorEntidadesQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => [VClasificadorEntidades], { nullable: true })
    data?: VClasificadorEntidades[];

    @Field(type => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class ClasificadorEntidadesQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => [ContaClasificarunidades], { nullable: true })
    data?: ContaClasificarunidades[];

    @Field(type => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class ClasificadorEntidadQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => ContaClasificarunidades, { nullable: true })
    data?: ContaClasificarunidades;

    @Field(type => String, { nullable: true })
    error?: String;
}

@InputType()
export class ClasificadorEntidadInput {
    @Field()
    IdUnidad: number;

    @Field()
    IdTipoEntidad: number;
}