import { MultipleQueryResponse, SingleQueryResponse } from './../shared/models/query.response.model';
import { CentrosView, Unidades } from './unidades.entity';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AllUnidadesQueryResponse extends MultipleQueryResponse(CentrosView) {}

@ObjectType()
export class AllUnidadQueryResponse extends SingleQueryResponse(CentrosView) {}

@ObjectType()
export class UnidadesQueryResponse extends MultipleQueryResponse(Unidades) {}

@ObjectType()
export class UnidadQueryResponse extends SingleQueryResponse(Unidades) {}
