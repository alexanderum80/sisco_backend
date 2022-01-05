import { Field, ObjectType } from '@nestjs/graphql';
import graphqlTypeJson, { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class QueryResponse {
    @Field()
    success: Boolean;

    @Field(type => GraphQLJSONObject, { nullable: true })
    data?: object

    @Field(type => String, { nullable: true })
    error?: string;
}