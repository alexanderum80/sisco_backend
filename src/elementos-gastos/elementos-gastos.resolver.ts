import { ElementosGastosService } from './elementos-gastos.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ContaElementosGastosEntity } from './elementos-gastos.entity';
import { ElementoGastoInput } from './elementos-gastos.model';
import { MutationResponse } from './../shared/models/mutation.response.model';

@Resolver(() => ContaElementosGastosEntity)
export class ElementosGastosResolver {
  constructor(private _elementoGastoSvc: ElementosGastosService) {}

  @Query(() => [ContaElementosGastosEntity])
  async getAllElementosGastos(): Promise<ContaElementosGastosEntity[]> {
    return this._elementoGastoSvc.getAllElementoGastos();
  }

  @Query(() => ContaElementosGastosEntity)
  async getElementoGastoById(@Args('id') id: string): Promise<ContaElementosGastosEntity> {
    return this._elementoGastoSvc.getElementoGastoById(id);
  }

  @Mutation(() => MutationResponse)
  async saveElementoGasto(@Args({ name: 'elementoGastoInfo', type: () => ElementoGastoInput }) elementoGastoInfo: ElementoGastoInput): Promise<MutationResponse> {
    return this._elementoGastoSvc.saveElementoGasto(elementoGastoInfo);
  }

  @Mutation(() => MutationResponse)
  async deleteElementoGasto(@Args('id') id: string): Promise<MutationResponse> {
    return this._elementoGastoSvc.deleteElementoGasto(id);
  }
}
