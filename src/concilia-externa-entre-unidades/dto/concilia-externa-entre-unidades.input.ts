import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ConciliacionExternaEntreUnidadesInput {
  @Field()
  Annio: number;

  @Field()
  Mes: number;

  @Field()
  IdUnidad: number;

  @Field()
  IdUnidadOD: number;

  @Field({ nullable: true })
  IdUsuarioEmisor: number;

  @Field({ nullable: true })
  IdUsuarioReceptor: number;

  @Field({ nullable: true })
  IdUsuarioSupervisor: number;

  @Field({ nullable: true })
  Nota: string;
}
