import { Usuarios } from './usuarios.entity';
import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { MultipleQueryResponse } from '../shared/models/query.response.model';
import { SingleQueryResponse } from '../shared/models/query.response.model';

export enum ETipoUsuarios {
    'Administrador' = 1,
    'Usuario' = 2,
    'Usuario Avanzado' = 3
}

@ObjectType()
export class UsuarioQueryResponse extends SingleQueryResponse(Usuarios) {
}

@ObjectType()
export class UsuariosQueryResponse extends MultipleQueryResponse(Usuarios) {
}

// Input Type
@InputType()
export class UsuarioDTO {
    @Field()
    IdUsuario: number;

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