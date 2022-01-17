import { MultipleQueryResponse, SingleQueryResponse } from 'src/shared/models/query.response.model';
import { CentrosView, Unidades } from './unidades.entity';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AllUnidadesQueryResponse extends MultipleQueryResponse(CentrosView) {}

@ObjectType()
export class AllUnidadQueryResponse extends SingleQueryResponse(CentrosView) {}

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
