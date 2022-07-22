import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CajaConfiguracionInput {
  @Field(() => Int)
  IdCaja?: number;

  @Field()
  IP: string;

  @Field()
  SN: string;

  @Field(() => Int)
  IdUnidad: number;
}
