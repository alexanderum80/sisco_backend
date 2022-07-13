import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MutationResponse {
    @Field()
    success: Boolean;

    @Field(() => String, { nullable: true })
    error?: string;
}