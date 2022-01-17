import { MultipleQueryResponse, SingleQueryResponse } from '../shared/models/query.response.model';
import { Supervisor } from './supervisores.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SupervisorQueryResponse extends SingleQueryResponse(Supervisor) {}

@ObjectType()
export class SupervisoresQueryResponse extends MultipleQueryResponse(Supervisor) {}

@InputType()
export class SupervisorDTO {
    @Field()
    IdSupervisor: number;

    @Field()
    Supervisor: string;

    @Field()
    IdCargo: number;

    @Field()
    IdDivision: number;
}
