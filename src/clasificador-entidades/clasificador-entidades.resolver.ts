import { MutationResponse } from '../shared/models/mutation.response.model';
import { ClasificadorEntidadQueryResponse, VClasificadorEntidadesQueryResponse, ClasificadorEntidadInput } from './clasificador-entidades.model';
import { ContaClasificarunidades } from './clasificador-entidades.entity';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClasificadorEntidadesService } from './clasificador-entidades.service';

@Resolver(of => ContaClasificarunidades)
export class ClasificadorEntidadesResolver {
    constructor(
        private clasificadorEntidadesSvc: ClasificadorEntidadesService
    ) {}

    @Query(() => VClasificadorEntidadesQueryResponse)
    async getAllClasificadorEntidades(): Promise<VClasificadorEntidadesQueryResponse> {
        return this.clasificadorEntidadesSvc.getAllClasificadorEntidades();
    }

    @Query(() => ClasificadorEntidadQueryResponse)
    async getClasificadorEntidad(
        @Args({ name: 'idUnidad', type: () => Int }) idUnidad: number,
    ): Promise<ClasificadorEntidadQueryResponse> {
        return this.clasificadorEntidadesSvc.getClasificadorEntidad(idUnidad);
    }

    @Mutation(() => MutationResponse)
    async saveClasificadorEntidad(
        @Args({ name: 'clasificadorEntidadInfo', type: () => ClasificadorEntidadInput }) clasificadorEntidadInfo: ClasificadorEntidadInput,
    ): Promise<MutationResponse> {
        return this.clasificadorEntidadesSvc.saveClasificadorEntidad(clasificadorEntidadInfo);
    }

    @Mutation(() => MutationResponse)
    async deleteClasificadorEntidad(
        @Args({ name: 'idUnidad', type: () => Int }) idUnidad: number,
    ): Promise<MutationResponse> {
        return this.clasificadorEntidadesSvc.deleteClasificadorEntidad(idUnidad);
    }

}
