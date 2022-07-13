import { MutationResponse } from '../shared/models/mutation.response.model';
import { ClasificadorEntidadQueryResponse, ClasificadorEntidadInput, ClasificadorEntidadesQueryResponse } from './clasificador-entidades.model';
import { ClasificarEntidades } from './clasificador-entidades.entity';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClasificadorEntidadesService } from './clasificador-entidades.service';

@Resolver(() => ClasificarEntidades)
export class ClasificadorEntidadesResolver {
    constructor(
        private clasificadorEntidadesSvc: ClasificadorEntidadesService
    ) {}

    @Query(() => ClasificadorEntidadesQueryResponse)
    async getAllClasificadorEntidades(): Promise<ClasificadorEntidadesQueryResponse> {
        return this.clasificadorEntidadesSvc.findAll();
    }
    
    @Query(() => ClasificadorEntidadQueryResponse)
    async getClasificadorEntidad(
        @Args({ name: 'idUnidad', type: () => Int }) idUnidad: number,
    ): Promise<ClasificadorEntidadQueryResponse> {
        return this.clasificadorEntidadesSvc.findOne(idUnidad);
    }

    @Mutation(() => MutationResponse)
    async createClasificadorEntidad(
        @Args({ name: 'clasificadorEntidadInfo', type: () => ClasificadorEntidadInput }) clasificadorEntidadInfo: ClasificadorEntidadInput,
    ): Promise<MutationResponse> {
        return this.clasificadorEntidadesSvc.create(clasificadorEntidadInfo);
    }

    @Mutation(() => MutationResponse)
    async updateClasificadorEntidad(
        @Args({ name: 'clasificadorEntidadInfo', type: () => ClasificadorEntidadInput }) clasificadorEntidadInfo: ClasificadorEntidadInput,
    ): Promise<MutationResponse> {
        return this.clasificadorEntidadesSvc.update(clasificadorEntidadInfo);
    }

    @Mutation(() => MutationResponse)
    async deleteClasificadorEntidad(
        @Args({ name: 'IDs', type: () => [Int] }) IDs: number[],
    ): Promise<MutationResponse> {
        return this.clasificadorEntidadesSvc.delete(IDs);
    }

}
