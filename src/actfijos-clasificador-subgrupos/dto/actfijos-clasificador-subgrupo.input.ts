import { InputType, Int, Field, Float } from '@nestjs/graphql';

@InputType()
export class ActFijosClasificadorSubgrupoInput {
  @Field(() => Int)
  Grupo: number;

  @Field(() => Int)
  Codigo: number;

  @Field()
  Descripcion: string;

  @Field(() => Float)
  Tasa: number;
}
