import { DEFAULT_GRAPHQL_CONTEXT } from './../shared/models/jwt.model';
import { Usuarios } from './../usuarios/usuarios.entity';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { ContaConexionesService } from './conta-conexiones.service';
import { ContaConexionesEntity } from './conta-conexiones.entity';
import { Args, Mutation, Query, Resolver, Int, Context } from '@nestjs/graphql';
import { ContaConexionQueryResponse, ContaConexionesQueryResponse, ContaConexionInput, EntidadesRodas } from './conta-conexiones.model';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../shared/helpers/auth.guard';

@Resolver(() => ContaConexionesEntity)
export class ContaConexionesResolver {
  constructor(private _contaConexionesService: ContaConexionesService) {}

  @Query(() => ContaConexionesQueryResponse)
  @UseGuards(new AuthGuard())
  async getAllContaConexiones(@Context(DEFAULT_GRAPHQL_CONTEXT) user: Usuarios): Promise<ContaConexionesQueryResponse> {
    return this._contaConexionesService.findAll(user);
  }

  @Query(() => ContaConexionQueryResponse)
  @UseGuards(new AuthGuard())
  async getContaConexionById(@Args({ name: 'id', type: () => Int }) id: number): Promise<ContaConexionQueryResponse> {
    return this._contaConexionesService.findOne(id);
  }

  @Query(() => [EntidadesRodas])
  // @UseGuards(new AuthGuard())
  async entidadesRodas(@Args('ip') ip: string): Promise<EntidadesRodas[]> {
    return this._contaConexionesService.getEntidadesRodas(ip);
  }

  @Mutation(() => MutationResponse)
  @UseGuards(new AuthGuard())
  async createContaConexion(@Args({ name: 'conexionInfo', type: () => ContaConexionInput }) conexionInfo: ContaConexionInput): Promise<MutationResponse> {
    return this._contaConexionesService.create(conexionInfo);
  }

  @Mutation(() => MutationResponse)
  @UseGuards(new AuthGuard())
  async updateContaConexion(@Args({ name: 'conexionInfo', type: () => ContaConexionInput }) conexionInfo: ContaConexionInput): Promise<MutationResponse> {
    return this._contaConexionesService.update(conexionInfo);
  }

  @Mutation(() => MutationResponse)
  @UseGuards(new AuthGuard())
  async deleteContaConexion(@Args({ name: 'IDs', type: () => [Int] }) IDs: number[]): Promise<MutationResponse> {
    return this._contaConexionesService.delete(IDs);
  }
}
