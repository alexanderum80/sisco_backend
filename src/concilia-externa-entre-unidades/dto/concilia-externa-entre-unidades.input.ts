import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ConciliacionEntreUnidadesInput {
  @Field()
  Annio: number;

  @Field()
  Mes: number;

  @Field()
  Unidad: number;

  @Field()
  UnidadOD: number;

  @Field({ nullable: true })
  UsuarioEmisor: number;

  @Field({ nullable: true })
  UsuarioReceptor: number;

  @Field({ nullable: true })
  UsuarioSupervisor: number;

  @Field({ nullable: true })
  Nota: string;
}
