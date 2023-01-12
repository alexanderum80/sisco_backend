import { ConciliaExtContabilidadInput } from './concilia-externa-contabilidad.model';
import { MutationResponse } from '../shared/models/mutation.response.model';
import { ConciliaExtContabilidadService } from './concilia-externa-contabilidad.service';
import { ConcExtContabilidad } from './concilia-externa-contabilidad.entity';
import { Resolver, Query, Int, Mutation, Args } from '@nestjs/graphql';

@Resolver(() => ConcExtContabilidad)
export class ConciliaExtContabilidadResolver {
  constructor(private _conciliacionContabService: ConciliaExtContabilidadService) {}

  @Query(() => [ConcExtContabilidad])
  async getDiferenciasEnConciliacion(@Args({ name: 'annio', type: () => Int }) annio: number, @Args({ name: 'mes', type: () => Int }) mes: number): Promise<ConcExtContabilidad[]> {
    return this._conciliacionContabService.getDiferenciasEnConciliacion(annio, mes);
  }

  @Mutation(() => MutationResponse)
  async updateConciliaContab(@Args({ name: 'data', type: () => [ConciliaExtContabilidadInput] }) data: ConciliaExtContabilidadInput[]): Promise<MutationResponse> {
    return this._conciliacionContabService.updateConciliaContab(data);
  }
}
