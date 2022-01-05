import { Supervisor } from './supervisores.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SupervisoresQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => [Supervisor], { nullable: true })
    data?: Supervisor[];

    @Field(type => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class SupervisorQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => Supervisor, { nullable: true })
    data?: Supervisor;

    @Field(type => String, { nullable: true })
    error?: String;
}

@InputType()
export class SupervisorInput {
    @Field()
    IdSupervisor: number;

    @Field()
    Supervisor: string;

    @Field()
    IdCargo: number;

    @Field()
    IdDivision: number;
}
