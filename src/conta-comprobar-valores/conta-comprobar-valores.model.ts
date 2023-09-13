import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ComprobarValoresInput {
  @Field()
  Id?: number;

  @Field()
  IdCentro: number;

  @Field()
  IdExpresion: number;

  @Field()
  IdOperador: string;

  @Field()
  Valor: number;

  @Field()
  IdDivision?: number;

  @Field()
  Consolidado: boolean;

  @Field()
  Activo: boolean;
}
