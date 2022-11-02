import { Divisiones } from './divisiones.entity';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class DivisionesQueryResponse {
  @Field()
  success: boolean;

  @Field(() => [Divisiones], { nullable: true })
  data?: Divisiones[];

  @Field(() => String, { nullable: true })
  error?: string;
}

@ObjectType()
export class DivisionQueryResponse {
  @Field()
  success: boolean;

  @Field(() => Divisiones, { nullable: true })
  data?: Divisiones;

  @Field(() => String, { nullable: true })
  error?: string;
}
