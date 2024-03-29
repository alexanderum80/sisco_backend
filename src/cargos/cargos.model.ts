import { Cargos } from './cargos.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CargosQueryResponse {
  @Field()
  success: boolean;

  @Field(() => [Cargos], { nullable: true })
  data?: Cargos[];

  @Field(() => String, { nullable: true })
  error?: string;
}
