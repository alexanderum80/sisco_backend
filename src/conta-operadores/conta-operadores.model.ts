import { ContaOperadoresEntity } from './conta-operadores.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ContaOperadoresQueryResponse {
  @Field()
  success: boolean;

  @Field(() => [ContaOperadoresEntity], { nullable: true })
  data?: ContaOperadoresEntity[];

  @Field(() => String, { nullable: true })
  error?: string;
}
