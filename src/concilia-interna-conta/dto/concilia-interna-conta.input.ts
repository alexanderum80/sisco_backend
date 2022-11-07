import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class ConciliaInternaContaInput {
  @Field(() => Int)
  annio: number;

  @Field(() => Int)
  periodo: number;

  @Field(() => Int)
  centro: number;

  @Field(() => Int)
  unidad: number;

  @Field(() => Int)
  emisorReceptor: number;
}
