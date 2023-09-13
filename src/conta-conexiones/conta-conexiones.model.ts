import { ObjectType, Field, InputType } from '@nestjs/graphql';

@InputType()
export class ContaConexionInput {
  @Field({ nullable: true })
  Id?: number;

  @Field()
  IdUnidad: number;

  @Field()
  Consolidado: boolean;

  @Field()
  IdDivision: number;

  @Field({ nullable: true })
  IpRodas: string;

  @Field({ nullable: true })
  BaseDatos: string;
}

@ObjectType()
export class EntidadesRodas {
  @Field()
  sigla: string;

  @Field()
  entidad: string;
}
