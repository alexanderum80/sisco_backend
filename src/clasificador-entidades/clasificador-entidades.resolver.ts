import { MutationResponse } from '../shared/models/mutation.response.model';
import { ClasificadorEntidadInput } from './clasificador-entidades.model';
import { ClasificarEntidadesEntity } from './clasificador-entidades.entity';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClasificadorEntidadesService } from './clasificador-entidades.service';

@Resolver(() => ClasificarEntidadesEntity)
export class ClasificadorEntidadesResolver {
  constructor(private clasificadorEntidadesSvc: ClasificadorEntidadesService) {}

  @Query(() => [ClasificarEntidadesEntity])
  async getAllClasificadorEntidades(): Promise<ClasificarEntidadesEntity[]> {
    return this.clasificadorEntidadesSvc.findAll();
  }

  @Query(() => ClasificarEntidadesEntity)
  async getClasificadorEntidad(@Args({ name: 'idUnidad', type: () => Int }) idUnidad: number): Promise<ClasificarEntidadesEntity> {
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
  async deleteClasificadorEntidad(@Args({ name: 'IDs', type: () => [Int] }) IDs: number[]): Promise<MutationResponse> {
    return this.clasificadorEntidadesSvc.delete(IDs);
  }
}
