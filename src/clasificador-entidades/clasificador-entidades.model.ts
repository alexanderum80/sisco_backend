import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ClasificadorEntidadInput {
  @Field()
  IdUnidad: number;

  @Field()
  IdTipoEntidad: number;
}
