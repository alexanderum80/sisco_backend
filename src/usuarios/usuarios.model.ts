import { UsuariosEntity } from './usuarios.entity';
import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { MultipleQueryResponse } from '../shared/models/query.response.model';
import { SingleQueryResponse } from '../shared/models/query.response.model';

export const UsuarioInfo: UsuariosEntity = {
  IdUsuario: 0,
  Usuario: '',
  IdTipoUsuario: 1,
  CambiarContrasena: false,
  IdDivision: 100,
  TipoUsuario: {
    IdTipo: 1,
    TipoUsuario: 'Administrador',
  },
  Division: {
    IdDivision: 100,
    Division: 'OFICINA CENTRAL DE LA CADENA',
  },
  Token: '',
  RefreshToken: '',
};

export enum ETipoUsuarios {
  'Administrador' = 1,
  'Usuario' = 2,
  'Usuario Avanzado' = 3,
}

@ObjectType()
export class UsuarioQueryResponse extends SingleQueryResponse(UsuariosEntity) {}

@ObjectType()
export class UsuariosQueryResponse extends MultipleQueryResponse(UsuariosEntity) {}

// Input Type
@InputType()
export class UsuarioInput {
  @Field()
  IdUsuario?: number;

  @Field()
  Usuario: string;

  @Field()
  Contrasena: string;

  @Field()
  IdTipoUsuario: number;

  @Field()
  CambiarContrasena: boolean;

  @Field()
  ContrasenaAvanzada: string;

  @Field()
  IdDivision: number;
}
