import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class ContaEstadisticaInput {
  @Field(() => Int)
  idDivision: number;

  @Field()
  annio: number;

  @Field()
  periodo: number;
}
