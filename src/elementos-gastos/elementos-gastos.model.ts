import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ElementoGastoInput {
  @Field()
  Egasto: string;

  @Field()
  Descripcion: string;

  @Field()
  UsoContenido: string;

  @Field()
  TipoEntidad: string;

  @Field()
  CuentaAsociada: string;

  @Field()
  IdEpigrafe: number;
}
