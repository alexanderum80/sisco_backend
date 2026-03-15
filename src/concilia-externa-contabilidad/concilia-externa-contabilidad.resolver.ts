import { ConciliaExternaContabilidadEntity, ViewConciliaExtContabilidadResumen, ViewConciliaExtContabilidadDeudasPorEdades } from './concilia-externa-contabilidad.model';
import { MutationResponse } from '../shared/models/mutation.response.model';
import { ConciliaExtContabilidadService } from './concilia-externa-contabilidad.service';
import { ConcExtContabilidad } from './entities/concilia-externa-contabilidad.entity';
import { Resolver, Query, Int, Mutation, Args } from '@nestjs/graphql';
import { ConciliaExternaContabilidadInput, ConciliaExternaContabilidadUpdateInput } from './dto/concilia-externa-contabilidad.input';

@Resolver(() => ConcExtContabilidad)
export class ConciliaExtContabilidadResolver {
  constructor(private _conciliacionContabService: ConciliaExtContabilidadService) {}

  @Query(() => ConciliaExternaContabilidadEntity)
  async getConciliacionExternaContab(
    @Args({ name: 'conciliaExternaInput', type: () => ConciliaExternaContabilidadInput }) conciliaExternaInput: ConciliaExternaContabilidadInput,
  ): Promise<ConciliaExternaContabilidadEntity> {
    return this._conciliacionContabService.getConciliacion(conciliaExternaInput);
  }

  @Query(() => [ViewConciliaExtContabilidadResumen])
  async getConciliacionExternaContabResumen(
    @Args({ name: 'annio', type: () => Int }) annio: number,
    @Args({ name: 'mes', type: () => Int }) mes: number,
    @Args({ name: 'mesActual', type: () => Boolean }) mesActual: boolean,
  ): Promise<ViewConciliaExtContabilidadResumen[]> {
    return this._conciliacionContabService.getDeudasResumen(annio, mes, mesActual);
  }

  @Query(() => [ViewConciliaExtContabilidadDeudasPorEdades])
  async getConciliacionExternaContabDeudasPorEdades(
    @Args({ name: 'annio', type: () => Int }) annio: number,
    @Args({ name: 'mes', type: () => Int }) mes: number,
    @Args({ name: 'mesActual', type: () => Boolean }) mesActual: boolean,
  ): Promise<ViewConciliaExtContabilidadDeudasPorEdades[]> {
    return this._conciliacionContabService.getDeudasPorEdades(annio, mes, mesActual);
  }

  @Query(() => [ConcExtContabilidad])
  async getDiferenciasEnConciliacion(@Args({ name: 'annio', type: () => Int }) annio: number, @Args({ name: 'mes', type: () => Int }) mes: number): Promise<ConcExtContabilidad[]> {
    return this._conciliacionContabService.getDiferenciasEnConciliacion(annio, mes);
  }

  @Mutation(() => MutationResponse)
  async updateConciliaContab(
    @Args({ name: 'data', type: () => [ConciliaExternaContabilidadUpdateInput] }) data: ConciliaExternaContabilidadUpdateInput[],
  ): Promise<MutationResponse> {
    return this._conciliacionContabService.updateConciliaContab(data);
  }
}
