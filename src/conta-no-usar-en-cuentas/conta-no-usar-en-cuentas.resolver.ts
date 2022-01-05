import { MutationResponse } from './../shared/models/mutation.response.model';
import { ContaNoUsarEnCuentasService } from './conta-no-usar-en-cuentas.service';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ContaNoUsarEnCuentasQueryResponse, ContaNoUsarEnCuentaQueryResponse, ContaNoUsarEnCuentaInput } from './conta-no-usar-en-cuenta.model';

@Resolver()
export class ContaNoUsarEnCuentasResolver {
    constructor(
        private _noUsarEnCuentaSvc: ContaNoUsarEnCuentasService
    ) {}

    @Query(() => ContaNoUsarEnCuentasQueryResponse)
    async getAllNoUsarEnCuenta(): Promise<ContaNoUsarEnCuentasQueryResponse> {
        return this._noUsarEnCuentaSvc.getAllNoUsarEnCuenta();
    }

    @Query(() => ContaNoUsarEnCuentaQueryResponse)
    async getNoUsarEnCuentaById(
        @Args({ name: 'id', type: () => Int }) id: number
    ): Promise<ContaNoUsarEnCuentaQueryResponse> {
        return this._noUsarEnCuentaSvc.getNoUsarEnCuentaById(id);
    }

    @Mutation(() => MutationResponse)
    async saveNoUsarEnCuenta(
        @Args({ name: 'noUsarEnCuentaInput', type: () => ContaNoUsarEnCuentaInput }) noUsarEnCuentaInput: ContaNoUsarEnCuentaInput
    ): Promise<MutationResponse> {
        return this._noUsarEnCuentaSvc.saveNoUsarEnCuenta(noUsarEnCuentaInput);
    }

    @Mutation(() => MutationResponse)
    async deleteNoUsarEnCuenta(
        @Args({ name: 'id', type: () => Int }) id: number
    ): Promise<MutationResponse> {
        return this._noUsarEnCuentaSvc.deleteNoUsarEnCuenta(id);
    }
}