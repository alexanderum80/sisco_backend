import { TipoUsuarios } from './tipo-usuarios.entity';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class TipoUsuariosQueryResponse {
    @Field()
    success: Boolean;

    @Field(() => [TipoUsuarios], { nullable: true })
    data?: TipoUsuarios[];

    @Field(() => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class TipoUsuarioQueryResponse {
    @Field()
    success: Boolean;

    @Field(() => TipoUsuarios, { nullable: true })
    data?: TipoUsuarios;

    @Field(() => String, { nullable: true })
    error?: String;
}