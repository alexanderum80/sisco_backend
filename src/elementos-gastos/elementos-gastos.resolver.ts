import { ElementosGastosService } from './elementos-gastos.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ContaElementosGastos } from './elementos-gastos.entity';
import { ElementosGastosQueryResponse, ElementoGastoQueryResponse, ElementoGastoInput } from './elementos-gastos.model';
import { MutationResponse } from './../shared/models/mutation.response.model';

@Resolver(() => ContaElementosGastos)
export class ElementosGastosResolver {
    constructor(
        private _elementoGastoSvc: ElementosGastosService
    ) {}

    @Query(() => ElementosGastosQueryResponse)
    async getAllElementosGastos(): Promise<ElementosGastosQueryResponse> {
        return this._elementoGastoSvc.getAllElementoGastos();
    }

    @Query(() => ElementoGastoQueryResponse)
    async getElementoGastoById(
        @Args('id') id: string
    ): Promise<ElementoGastoQueryResponse> {
        return this._elementoGastoSvc.getElementoGastoById(id);
    }

    @Mutation(() => MutationResponse)
    async saveElementoGasto(
        @Args({ name: 'elementoGastoInfo', type: () => ElementoGastoInput }) elementoGastoInfo: ElementoGastoInput
    ): Promise<MutationResponse> {
        return this._elementoGastoSvc.saveElementoGasto(elementoGastoInfo);
    }

    @Mutation(() => MutationResponse)
    async deleteElementoGasto(
        @Args('id') id: string
    ): Promise<MutationResponse> {
        return this._elementoGastoSvc.deleteElementoGasto(id);
    }

}
