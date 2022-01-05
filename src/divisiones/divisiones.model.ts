import { Divisiones } from './divisiones.entity';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class DivisionesQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => [Divisiones], { nullable: true })
    data?: Divisiones[];

    @Field(type => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class DivisionQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => Divisiones, { nullable: true })
    data?: Divisiones;

    @Field(type => String, { nullable: true })
    error?: String;
}
