import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MutationResponse } from 'src/shared/models/mutation.response.model';
import { ContaComprobarExpresionesEntity } from './conta-comprobar-expresiones.entity';
import { ContaComprobarExpresionesInput, ContaComprobarExpresionesQueryResponse, ContaComprobarExpresionQueryResponse } from './conta-comprobar-expresiones.model';
import { ContaComprobarExpresionesService } from './conta-comprobar-expresiones.service';

@Resolver(of => ContaComprobarExpresionesEntity)
export class ContaComprobarExpresionesResolver {
    constructor(
        private _comprobarExpresionesSvc: ContaComprobarExpresionesService
    ) {}

    @Query(() => ContaComprobarExpresionesQueryResponse)
    async getAllComprobarExpresiones(): Promise<ContaComprobarExpresionesQueryResponse> {
        return this._comprobarExpresionesSvc.getAllComprobarExpresiones();
    }

    @Query(() => ContaComprobarExpresionQueryResponse)
    async getComprobarExpresionById(
        @Args({ name: 'id', type: () => Int}) id: number
    ): Promise<ContaComprobarExpresionQueryResponse> {
        return this._comprobarExpresionesSvc.getComprobarExpresionById(id);
    }

    @Mutation(() => MutationResponse)
    async saveComprobarExpresion(
        @Args({ 'name': 'comprobarExpresionInput', type: () => ContaComprobarExpresionesInput }) comprobarExpresionInput: ContaComprobarExpresionesInput
    ): Promise<MutationResponse> {
        return this._comprobarExpresionesSvc.saveComprobarExpresion(comprobarExpresionInput);
    }

    @Mutation(() => MutationResponse)
    async deleteComprobarExpresion(
        @Args({ name: 'id', type: () => Int}) id: number
    ): Promise<MutationResponse> {
        return this._comprobarExpresionesSvc.deleteComprobarExpresion(id);
    }

}
