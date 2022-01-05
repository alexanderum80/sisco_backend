import { Usuarios } from './usuarios.entity';
import { ObjectType, Field, InputType } from '@nestjs/graphql';

export enum ETipoUsuarios {
    'Administrador' = 1,
    'Usuario' = 2,
    'Usuario Avanzado' = 3
}


@ObjectType()
export class UsuarioQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => Usuarios, { nullable: true })
    data?: Usuarios;

    @Field(type => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class UsuariosQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => [Usuarios], { nullable: true })
    data?: Usuarios[];

    @Field(type => String, { nullable: true })
    error?: String;
}

// Input Type
@InputType()
export class UsuarioInput {
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