import { ConciliacionExternaEntreUnidadesInput } from './dto/concilia-externa-entre-unidades.input';
import { ConciliaExternaEntreUnidadesEntity, ConciliaExternaCentrosNoConciliados } from './entities/concilia-externa-entre-unidades.entity';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ConciliaExternaEntreUnidadesService } from './concilia-externa-entre-unidades.service';

@Resolver(() => ConciliaExternaEntreUnidadesEntity)
export class ConciliaExternaEntreUnidadesResolver {
  constructor(private readonly _conciliacionUnidadesService: ConciliaExternaEntreUnidadesService) {}

  @Query(() => ConciliaExternaEntreUnidadesEntity, { nullable: true })
  async getConciliacionEntreUnidades(
    @Args({ name: 'annio', type: () => Int }) annio: number,
    @Args({ name: 'mes', type: () => Int }) mes: number,
    @Args({ name: 'unidad', type: () => Int }) unidad: number,
    @Args({ name: 'unidadOD', type: () => Int }) unidadOD: number,
  ): Promise<ConciliaExternaEntreUnidadesEntity | null> {
    return this._conciliacionUnidadesService.getConciliacionEntreUnidades(annio, mes, unidad, unidadOD);
  }

  @Query(() => [ConciliaExternaCentrosNoConciliados])
  async getCentrosNoConciliados(
    @Args({ name: 'annio', type: () => Int }) annio: number,
    @Args({ name: 'mes', type: () => Int }) mes: number,
  ): Promise<ConciliaExternaCentrosNoConciliados[]> {
    return this._conciliacionUnidadesService.getCentrosNoConciliados(annio, mes);
  }

  @Mutation(() => Number)
  async updateConciliacionEntreUnidades(
    @Args({ name: 'conciliacionUnidadesInput', type: () => ConciliacionExternaEntreUnidadesInput }) conciliacionUnidadesInput: ConciliacionExternaEntreUnidadesInput,
  ): Promise<number> {
    return this._conciliacionUnidadesService.updateConciliacionEntreUnidades(conciliacionUnidadesInput);
  }
}
