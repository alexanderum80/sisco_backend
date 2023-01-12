import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ConciliaExternaDwhInput {
  @Field()
  Id: number;

  @Field()
  Recibido: boolean;
}
