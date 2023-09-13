import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ConciliaExternaContabilidadUpdateInput {
  @Field()
  Id: number;

  @Field()
  Recibido: boolean;
}

@InputType()
export class ConciliaExternaContabilidadInput {
  @Field()
  Annio: number;

  @Field()
  Mes: number;

  @Field()
  MesActual: boolean;

  @Field({ nullable: true })
  Division?: number;

  @Field()
  Unidad: number;

  @Field({ nullable: true })
  DivisionOD?: number;

  @Field()
  UnidadOD: number;

  @Field({ nullable: true })
  UsuarioEmisor?: number;

  @Field({ nullable: true })
  UsuarioReceptor?: number;

  @Field({ nullable: true })
  UsuarioSupervisor?: number;

  @Field({ nullable: true })
  Nota?: string;
}
