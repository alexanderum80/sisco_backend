import { Divisiones } from './divisiones.entity';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class DivisionesQueryResponse {
    @Field()
    success: Boolean;

    @Field(() => [Divisiones], { nullable: true })
    data?: Divisiones[];

    @Field(() => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class DivisionQueryResponse {
    @Field()
    success: Boolean;

    @Field(() => Divisiones, { nullable: true })
    data?: Divisiones;

    @Field(() => String, { nullable: true })
    error?: String;
}
