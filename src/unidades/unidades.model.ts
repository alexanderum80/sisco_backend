import { Unidades } from './unidades.entity';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AllUnidades {
    @Field()
    IdUnidad: number;

    @Field()
    Nombre: string;

    @Field()
    IdSubdivision: number;

    @Field()
    Subdivision: string;

    @Field()
    IdDivision: number;

    @Field()
    Division: string;

    @Field()
    Abierta: boolean;
}

@ObjectType()
export class AllUnidadesQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => [AllUnidades], { nullable: true })
    data?: AllUnidades[];

    @Field(type => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class AllUnidadQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => AllUnidades, { nullable: true })
    data?: AllUnidades;

    @Field(type => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class UnidadesQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => [Unidades], { nullable: true })
    data?: Unidades[];

    @Field(type => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class UnidadQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => Unidades, { nullable: true })
    data?: Unidades;

    @Field(type => String, { nullable: true })
    error?: String;
}
