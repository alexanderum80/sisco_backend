import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ContaComprobarExpresionesInput {
  @Field()
  Id?: number;

  @Field()
  IdExpresion: number;

  @Field()
  IdOperador: string;

  @Field()
  IdExpresionC: number;

  @Field()
  Centro: boolean;

  @Field()
  Complejo: boolean;

  @Field()
  Con: boolean;

  @Field()
  Centralizada: boolean;

  @Field()
  IdDivision: number;
}
