import { TipoUsuarios } from './tipo-usuarios.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class TipoUsuariosQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => [TipoUsuarios], { nullable: true })
    data?: TipoUsuarios[];

    @Field(type => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class TipoUsuarioQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => TipoUsuarios, { nullable: true })
    data?: TipoUsuarios;

    @Field(type => String, { nullable: true })
    error?: String;
}