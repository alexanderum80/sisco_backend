import { Usuarios } from './../usuarios/usuarios.entity';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { ContaConexionesService } from './conta-conexiones.service';
import { ContaConexiones } from './conta-conexiones.entity';
import { Args, Mutation, Query, Resolver, Int, Context } from '@nestjs/graphql';
import { ContaConexionInput, ViewContaConexionesQueryResponse, EstadoConexionesRodasQueryResponse, ContaConexionQueryResponse } from './conta-conexiones.model';
import { UseGuards } from '@nestjs/common';
import { AuthGuard, DEFAULT_GRAPHQL_CONTEXT } from '../shared/helpers/auth.guard';

@Resolver(of => ContaConexiones)
export class ContaConexionesResolver {
    constructor(
        private _contaConexionesService: ContaConexionesService
    ) {}

    @Query(() => ViewContaConexionesQueryResponse)
    @UseGuards(new AuthGuard())
    async getAllContaConexiones(@Context(DEFAULT_GRAPHQL_CONTEXT) user: Usuarios): Promise<ViewContaConexionesQueryResponse> {
        return this._contaConexionesService.findAll(user);
    }

    @Query(() => ContaConexionQueryResponse)
    @UseGuards(new AuthGuard())
    async getContaConexionById(
        @Args({ name: 'id', type: () => Int }) id: number
    ): Promise<ContaConexionQueryResponse> {
        return this._contaConexionesService.findOne(id);
    }

    @Query(() => ViewContaConexionesQueryResponse)
    @UseGuards(new AuthGuard())
    async getContaConexionesByDivision(
        @Args({ name: 'idDivision', type: () => Int }) idDivision: number
    ): Promise<ViewContaConexionesQueryResponse> {
        return this._contaConexionesService.findByDivision(idDivision);
    }

    @Query(() => EstadoConexionesRodasQueryResponse)
    @UseGuards(new AuthGuard())
    async estadoContaConexiones(
        @Args({ name: 'idDivision', type: () => Int }) idDivision: number
    ): Promise<EstadoConexionesRodasQueryResponse> {
        return this._contaConexionesService.estadoContaConexiones(idDivision);
    }

    @Mutation(() => MutationResponse)
    @UseGuards(new AuthGuard())
    async createContaConexion(
        @Args({ name: 'conexionInfo', type: () => ContaConexionInput }) conexionInfo: ContaConexionInput
    ): Promise<MutationResponse> {
        return this._contaConexionesService.create(conexionInfo);
    }
    
    @Mutation(() => MutationResponse)
    @UseGuards(new AuthGuard())
    async updateContaConexion(
        @Args({ name: 'conexionInfo', type: () => ContaConexionInput }) conexionInfo: ContaConexionInput
    ): Promise<MutationResponse> {
        return this._contaConexionesService.update(conexionInfo);
    }

    @Mutation(() => MutationResponse)
    @UseGuards(new AuthGuard())
    async deleteContaConexion(
        @Args({ name: 'IDs', type: () => [Int] }) IDs: number[]
    ): Promise<MutationResponse> {
        return this._contaConexionesService.delete(IDs);
    }
}
