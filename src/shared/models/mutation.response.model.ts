import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MutationResponse {
    @Field()
    success: boolean;

    @Field(() => String, { nullable: true })
    error?: string;
}
