import { Usuarios } from './../usuarios/usuarios.entity';
import { AuthGuard, DEFAULT_GRAPHQL_CONTEXT } from './../shared/helpers/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { ContaComprobarExpresionesEntity } from './conta-comprobar-expresiones.entity';
import { ContaComprobarExpresionesInput, ContaComprobarExpresionesQueryResponse, ContaComprobarExpresionQueryResponse } from './conta-comprobar-expresiones.model';
import { ContaComprobarExpresionesService } from './conta-comprobar-expresiones.service';

@Resolver(of => ContaComprobarExpresionesEntity)
export class ContaComprobarExpresionesResolver {
    constructor(
        private _comprobarExpresionesSvc: ContaComprobarExpresionesService
    ) {}

    @Query(() => ContaComprobarExpresionesQueryResponse)
    @UseGuards(new AuthGuard())
    async getAllComprobarExpresiones(@Context(DEFAULT_GRAPHQL_CONTEXT) user: Usuarios): Promise<ContaComprobarExpresionesQueryResponse> {
        return this._comprobarExpresionesSvc.findAll(user);
    }

    @Query(() => ContaComprobarExpresionQueryResponse)
    async getComprobarExpresionById(
        @Args({ name: 'id', type: () => Int}) id: number
    ): Promise<ContaComprobarExpresionQueryResponse> {
        return this._comprobarExpresionesSvc.findOne(id);
    }

    @Mutation(() => MutationResponse)
    @UseGuards(new AuthGuard())
    async createComprobarExpresion(
        @Context(DEFAULT_GRAPHQL_CONTEXT) user: Usuarios,
        @Args({ 'name': 'comprobarExpresionInput', type: () => ContaComprobarExpresionesInput }) comprobarExpresionInput: ContaComprobarExpresionesInput
    ): Promise<MutationResponse> {
        return this._comprobarExpresionesSvc.create(user, comprobarExpresionInput);
    }

    @Mutation(() => MutationResponse)
    async updateComprobarExpresion(
        @Args({ 'name': 'comprobarExpresionInput', type: () => ContaComprobarExpresionesInput }) comprobarExpresionInput: ContaComprobarExpresionesInput
    ): Promise<MutationResponse> {
        return this._comprobarExpresionesSvc.update(comprobarExpresionInput);
    }

    @Mutation(() => MutationResponse)
    async deleteComprobarExpresion(
        @Args({ name: 'IDs', type: () => [Int]}) IDs: number[]
    ): Promise<MutationResponse> {
        return this._comprobarExpresionesSvc.delete(IDs);
    }

}
