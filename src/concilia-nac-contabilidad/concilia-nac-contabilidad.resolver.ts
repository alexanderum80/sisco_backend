import { MutationResponse } from './../shared/models/mutation.response.model';
import { ViewConciliaNacContabilidadQueryResponse, ConciliaNacContabilidadInput, ActaConciliacionQueryResponse } from './concilia-nac-contabilidad.model';
import { ConciliaNacContabilidadService } from './concilia-nac-contabilidad.service';
import { ConcnacContabilidad } from './concilia-nac-contabilidad.entity';
import { Resolver, Query, Int, Mutation, Args } from '@nestjs/graphql';

@Resolver(() => ConcnacContabilidad)
export class ConciliaNacContabilidadResolver {
    constructor(
        private _conciliacionContabService: ConciliaNacContabilidadService
    ) {}

    @Query(() => ViewConciliaNacContabilidadQueryResponse)
    async conciliacionContab(
        @Args({ name: 'annio', type: () => Int }) annio: number,
        @Args({ name: 'mes', type: () => Int }) mes: number,
        @Args({ name: 'division', type: () => Int }) division: number,
        @Args({ name: 'unidad', type: () => Int }) unidad: number,
        @Args({ name: 'divisionOD', type: () => Int }) divisionOD: number,
        @Args({ name: 'unidadOD', type: () => Int }) unidadOD: number
    ): Promise<ViewConciliaNacContabilidadQueryResponse> {
        return this._conciliacionContabService.conciliacionContab(annio, mes, division, unidad, divisionOD, unidadOD);
    }

    @Query(() => ActaConciliacionQueryResponse)
    async actaConciliacion(
        @Args({ name: 'annio', type: () => Int }) annio: number,
        @Args({ name: 'mes', type: () => Int }) mes: number,
        @Args({ name: 'unidad', type: () => Int }) unidad: number,
        @Args({ name: 'unidadOD', type: () => Int }) unidadOD: number
    ): Promise<ActaConciliacionQueryResponse> {
        return this._conciliacionContabService.actaConciliacion(annio, mes, unidad, unidadOD);
    }

    @Mutation(() => MutationResponse)
    async conciliacionNacionalVsAsiento(
        @Args({ name: 'annio', type: () => Int }) annio: number,
        @Args({ name: 'mes', type: () => Int }) mes: number,
        @Args({ name: 'division', type: () => Int }) division: number,
        @Args({ name: 'unidad', type: () => Int }) unidad: number,
        @Args({ name: 'divisionOD', type: () => Int }) divisionOD: number,
        @Args({ name: 'unidadOD', type: () => Int }) unidadOD: number
    ): Promise<MutationResponse> {
        return this._conciliacionContabService.conciliacionNacionalVsAsiento(annio, mes, division, unidad, divisionOD, unidadOD);
    }

    @Mutation(() => MutationResponse)
    async updateConciliaContab(
        @Args({ name: 'data', type: () => [ConciliaNacContabilidadInput]}) data: ConciliaNacContabilidadInput[],
    ): Promise<MutationResponse> {
        return this._conciliacionContabService.updateConciliaContab(data);
    }
}
