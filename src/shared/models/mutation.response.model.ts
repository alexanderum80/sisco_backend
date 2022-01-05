import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MutationResponse {
    @Field()
    success: Boolean;

    @Field(type => String, { nullable: true })
    error?: string;
}