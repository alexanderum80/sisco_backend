import { MultipleQueryResponse, SingleQueryResponse } from './../shared/models/query.response.model';
import { ClasificarEntidades } from './clasificador-entidades.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ClasificadorEntidadesQueryResponse extends MultipleQueryResponse(ClasificarEntidades) {}

@ObjectType()
export class ClasificadorEntidadQueryResponse extends SingleQueryResponse(ClasificarEntidades) {}

@InputType()
export class ClasificadorEntidadInput {
    @Field()
    IdUnidad: number;

    @Field()
    IdTipoEntidad: number;
}