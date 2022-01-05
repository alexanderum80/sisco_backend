import { ContaExpresionesResumen, ContaExpresionesDetalle } from './conta-expresiones.entity';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ContaExpresionDetalleQueryResponse, ContaExpresionesDetalleQueryResponse, ContaExpresionesResumenQueryResponse, ContaExpresionInput, ContaExpresionResumenQueryResponse } from './conta-expresiones.model';
import { ContaExpresionesService } from './conta-expresiones.service';
import { MutationResponse } from '../shared/models/mutation.response.model';
import { UseGuards } from '@nestjs/common';
import { AuthGuard, DEFAULT_GRAPHQL_CONTEXT } from 'src/shared/helpers/auth.guard';
import { Usuarios } from 'src/usuarios/usuarios.entity';

@Resolver(of => ContaExpresionesResumen)
export class ContaExpresionesResumenResolver {
    constructor(
        private expresionesSvc: ContaExpresionesService
    ) {}

    @Query(() => ContaExpresionesResumenQueryResponse)
    async getAllExpresionesResumen(): Promise<ContaExpresionesResumenQueryResponse> {
        return this.expresionesSvc.getAllExpresionesResumen();
    }

    @Query(() => ContaExpresionResumenQueryResponse)
    async getExpresionResumenById(
        @Args({ name: 'id', type: () => Int }) id: number
    ): Promise<ContaExpresionResumenQueryResponse> {
        return this.expresionesSvc.getExpresionResumenById(id);
    }

    @Mutation(() => MutationResponse)
    @UseGuards(new AuthGuard())
    async saveExpresion(
        @Context(DEFAULT_GRAPHQL_CONTEXT) user: Usuarios,
        @Args({ name: 'expresionInput', type: () => ContaExpresionInput }) expresionInput: ContaExpresionInput
    ): Promise<MutationResponse> {
        return this.expresionesSvc.saveExpresion(user, expresionInput);
    }

    @Mutation(() => MutationResponse)
    async deleteExpresionResumen(
        @Args({ name: 'id', type: () => Int }) id: number
    ): Promise<MutationResponse> {
        return this.expresionesSvc.deleteExpresionResumen(id);
    }
}

@Resolver(of => ContaExpresionesDetalle)
export class ContaExpresionesDetalleResolver {
    constructor(
        private expresionesSvc: ContaExpresionesService
    ) {}

    @Query(() => ContaExpresionesDetalleQueryResponse)
    async getAllExpresionesDetalle(): Promise<ContaExpresionesDetalleQueryResponse> {
        return this.expresionesSvc.getAllExpresionesDetalle();
    }

    @Query(() => ContaExpresionesDetalleQueryResponse)
    async getExpresionesDetalleByIdResumen(
        @Args({ name: 'idResumen', type: () => Int }) idResumen: number
    ): Promise<ContaExpresionesDetalleQueryResponse> {
        return this.expresionesSvc.getExpresionesDetalleByIdResumen(idResumen);
    }

    @Query(() => ContaExpresionDetalleQueryResponse)
    async getExpresionDetalleById(
        @Args({ name: 'id', type: () => Int }) id: number
    ): Promise<ContaExpresionDetalleQueryResponse> {
        return this.expresionesSvc.getExpresionDetalleById(id);
    }

    @Mutation(() => MutationResponse)
    async deleteExpresionDetalle(
        @Args({ name: 'id', type: () => [Int] }) id: number[]
    ): Promise<MutationResponse> {
        return this.expresionesSvc.deleteExpresionDetalle(id);
    }
}
