import { MultipleQueryResponse, SingleQueryResponse } from '../shared/models/query.response.model';
import { ContaConexiones, ContaConexionesView } from './conta-conexiones.entity';
import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
export class ContaConexionQueryResponse extends SingleQueryResponse(ContaConexiones) {}

@ObjectType()
export class ContaConexionesQueryResponse extends MultipleQueryResponse(ContaConexionesView) {}

@InputType()
export class ContaConexionDTO {
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
export class EstadoConexionesRodasQueryResponse extends MultipleQueryResponse(EstadoConexionesRodas) {}
