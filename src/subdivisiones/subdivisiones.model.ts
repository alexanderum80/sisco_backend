import { Subdivisiones } from './subdivisiones.entity';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SubdivisionesQueryResponse {
    @Field()
    success: boolean;

    @Field(() => [Subdivisiones], { nullable: true })
    data?: Subdivisiones[];

    @Field({ nullable: true })
    error?: string;
}