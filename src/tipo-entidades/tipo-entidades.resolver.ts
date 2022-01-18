import { MutationResponse } from './../shared/models/mutation.response.model';
import { ContaTipoentidadesQueryResponse, ContaTipoentidadQueryResponse, TipoEntidadInput } from './tipo-entidades.model';
import { TipoEntidadesService } from './tipo-entidades.service';
import { ContaTipoentidades } from './tipo-entidades.entity';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver(of => ContaTipoentidades)
export class TipoEntidadesResolver {
    constructor(
        private tipoEntidadesSvc: TipoEntidadesService
    ) {}

    @Query(() => ContaTipoentidadesQueryResponse)
    async getAllTipoEntidades(): Promise<ContaTipoentidadesQueryResponse> {
        return this.tipoEntidadesSvc.getAllTipoEntidades();
    }

    @Query(() => ContaTipoentidadQueryResponse)
    async getTipoEntidadById(
        @Args({ name: 'id', type: () => Int }) id: number
    ): Promise<ContaTipoentidadQueryResponse> {
        return this.tipoEntidadesSvc.getTipoEntidadById(id);
    }

    @Mutation(() => MutationResponse)
    async createTipoEntidad(
        @Args({ name: 'tipoEntidadInfo', type: () => TipoEntidadInput }) tipoEntidadInfo: TipoEntidadInput
    ): Promise<MutationResponse> {
        return this.tipoEntidadesSvc.createTipoEntidad(tipoEntidadInfo);
    }
    
    @Mutation(() => MutationResponse)
    async updateTipoEntidad(
        @Args({ name: 'tipoEntidadInfo', type: () => TipoEntidadInput }) tipoEntidadInfo: TipoEntidadInput
    ): Promise<MutationResponse> {
        return this.tipoEntidadesSvc.updateTipoEntidad(tipoEntidadInfo);
    }

    @Mutation(() => MutationResponse)
    async deleteTipoEntidad(
        @Args({ name: 'IDs', type: () => [Int] }) IDs: number[]
    ): Promise<MutationResponse> {
        return this.tipoEntidadesSvc.deleteTipoEntidad(IDs);
    }
}
