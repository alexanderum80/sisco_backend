import { DWHConexiones } from './dwh-conexiones.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DWHConexionesQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => [DWHConexiones], { nullable: true })
    data?: DWHConexiones[];

    @Field(type => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class DWHConexionQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => DWHConexiones, { nullable: true })
    data?: DWHConexiones;

    @Field(type => String, { nullable: true })
    error?: String;
}

@InputType()
export class DWHConexionesInput {
    @Field()
    IdUnidad: number;

    @Field()
    DWH_ip: string;

    @Field()
    DWH_usuario: string;

    @Field()
    DWH_contrasena: string;

    @Field()
    DWH_baseDatos: string;

    @Field()
    Rest_ip: string;

    @Field()
    Rest_usuario: string;

    @Field()
    Rest_contrasena: string;

    @Field()
    Rest_baseDatos: string;
}