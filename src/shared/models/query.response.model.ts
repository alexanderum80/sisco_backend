import { Field, ObjectType } from '@nestjs/graphql';
import { ClassType } from 'graphql-composer';

export function SingleQueryResponse<TItem>(TItemClass: ClassType<TItem>) {
  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true })
  abstract class QueryResponseClass {
    @Field(() => Boolean)
    success: boolean;

    @Field(() => TItemClass, { nullable: true })
    data?: TItem;

    @Field(() => String, { nullable: true })
    error?: string;
  }

  return QueryResponseClass as ClassType;
}

export function MultipleQueryResponse<TItem>(TItemClass: ClassType<TItem>) {
  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true })
  abstract class QueryResponseClass {
    @Field(() => Boolean)
    success: boolean;

    @Field(() => [TItemClass], { nullable: true })
    data?: TItem[];

    @Field(() => String, { nullable: true })
    error?: string;
  }

  return QueryResponseClass as ClassType;
}
