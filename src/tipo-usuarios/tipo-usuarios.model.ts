import { TipoUsuarios } from './tipo-usuarios.entity';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class TipoUsuariosQueryResponse {
  @Field()
  success: boolean;

  @Field(() => [TipoUsuarios], { nullable: true })
  data?: TipoUsuarios[];

  @Field(() => String, { nullable: true })
  error?: string;
}

@ObjectType()
export class TipoUsuarioQueryResponse {
  @Field()
  success: boolean;

  @Field(() => TipoUsuarios, { nullable: true })
  data?: TipoUsuarios;

  @Field(() => String, { nullable: true })
  error?: string;
}
