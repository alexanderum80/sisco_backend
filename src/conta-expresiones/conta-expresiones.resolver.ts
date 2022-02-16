import { Usuarios } from './../usuarios/usuarios.entity';
import { AuthGuard, DEFAULT_GRAPHQL_CONTEXT } from './../shared/helpers/auth.guard';
import { ExpresionesResumenEntity, ExpresionesDetalleEntity } from './conta-expresiones.entity';
import { Args, Int, Mutation, Query, Resolver, Context } from '@nestjs/graphql';
import { ContaExpresionDetalleQueryResponse, ContaExpresionesDetalleQueryResponse, ContaExpresionesResumenQueryResponse, ContaExpresionInput, ContaExpresionResumenQueryResponse } from './conta-expresiones.model';
import { ContaExpresionesService } from './conta-expresiones.service';
import { MutationResponse } from '../shared/models/mutation.response.model';
import { UseGuards } from '@nestjs/common';

@Resolver(of => ExpresionesResumenEntity)
export class ContaExpresionesResumenResolver {
    constructor(
        private expresionesSvc: ContaExpresionesService
    ) {}

    @Query(() => ContaExpresionesResumenQueryResponse)
    @UseGuards(new AuthGuard())
    async getAllExpresionesResumen(@Context(DEFAULT_GRAPHQL_CONTEXT) user: Usuarios): Promise<ContaExpresionesResumenQueryResponse> {
        return this.expresionesSvc.findAllResumen(user);
    }

    @Query(() => ContaExpresionResumenQueryResponse)
    async getExpresionResumenById(
        @Args({ name: 'id', type: () => Int }) id: number
    ): Promise<ContaExpresionResumenQueryResponse> {
        return this.expresionesSvc.findOneResumen(id);
    }

    @Mutation(() => MutationResponse)
    @UseGuards(new AuthGuard())
    async createExpresion(
        @Context(DEFAULT_GRAPHQL_CONTEXT) user: Usuarios,
        @Args({ name: 'expresionInput', type: () => ContaExpresionInput }) expresionInput: ContaExpresionInput
    ): Promise<MutationResponse> {
        return this.expresionesSvc.create(user, expresionInput);
    }

    @Mutation(() => MutationResponse)
    async updateExpresion(
        @Args({ name: 'expresionInput', type: () => ContaExpresionInput }) expresionInput: ContaExpresionInput
    ): Promise<MutationResponse> {
        return this.expresionesSvc.update(expresionInput);
    }

    @Mutation(() => MutationResponse)
    async deleteExpresionResumen(
        @Args({ name: 'IDs', type: () => [Int] }) IDs: number[]
    ): Promise<MutationResponse> {
        return this.expresionesSvc.deleteResumen(IDs);
    }
}

@Resolver(of => ExpresionesDetalleEntity)
export class ContaExpresionesDetalleResolver {
    constructor(
        private expresionesSvc: ContaExpresionesService
    ) {}

    @Query(() => ContaExpresionesDetalleQueryResponse)
    async getAllExpresionesDetalle(): Promise<ContaExpresionesDetalleQueryResponse> {
        return this.expresionesSvc.findAllDetalle();
    }

    @Query(() => ContaExpresionesDetalleQueryResponse)
    async getExpresionesDetalleByIdResumen(
        @Args({ name: 'idResumen', type: () => Int }) idResumen: number
    ): Promise<ContaExpresionesDetalleQueryResponse> {
        return this.expresionesSvc.findOneDetalleByResumen(idResumen);
    }

    @Query(() => ContaExpresionDetalleQueryResponse)
    async getExpresionDetalleById(
        @Args({ name: 'id', type: () => Int }) id: number
    ): Promise<ContaExpresionDetalleQueryResponse> {
        return this.expresionesSvc.findOneDetalle(id);
    }

    @Mutation(() => MutationResponse)
    async deleteExpresionDetalle(
        @Args({ name: 'id', type: () => [Int] }) id: number[]
    ): Promise<MutationResponse> {
        return this.expresionesSvc.deleteDetalle(id);
    }
}
