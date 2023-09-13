import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateConciliaExternaDatosConciliacionInput {
  @Field(() => Int)
  Annio: number;

  @Field(() => Int)
  Mes: number;
}
