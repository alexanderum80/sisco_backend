import { ContaConexiones } from './conta-conexiones.entity';
import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
export class ContaConexionQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => ContaConexiones, { nullable: true })
    data?: ContaConexiones;

    @Field(type => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class ContaConexionesQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => [ContaConexiones], { nullable: true })
    data?: ContaConexiones[];

    @Field(type => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class ViewContaConexionesQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => [ViewContaConexiones], { nullable: true })
    data?: ViewContaConexiones[];

    @Field(type => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class ViewContaConexiones {
    @Field({ nullable: true })
    Id: number;

    @Field()
    IdUnidad: number;

    @Field()
    Unidad: string;

    @Field()
    Consolidado: string;

    @Field()
    IdDivision: number;

    @Field()
    Division: string;

    @Field({ nullable: true })
    IpRodas: string;

    @Field({ nullable: true })
    Usuario: string;

    @Field({ nullable: true })
    Contrasena: string;

    @Field({ nullable: true })
    BaseDatos: string;
}

@InputType()
export class ContaConexionInput {
    @Field({ nullable: true })
    Id: number;

    @Field()
    IdUnidad: number;

    @Field()
    Consolidado: boolean;

    @Field()
    IdDivision: number;

    @Field({ nullable: true })
    IpRodas: string;

    @Field({ nullable: true })
    Usuario: string;

    @Field({ nullable: true })
    Contrasena: string;

    @Field({ nullable: true })
    BaseDatos: string;
}

@ObjectType()
export class EstadoConexionesRodas {
    @Field()
    Unidad: string;

    @Field()
    Estado: string;
}

@ObjectType()
export class EstadoConexionesRodasQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => [EstadoConexionesRodas], { nullable: true })
    data?: EstadoConexionesRodas[];

    @Field(type => String, { nullable: true })
    error?: String;
}
