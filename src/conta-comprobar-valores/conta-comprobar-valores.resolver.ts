import { MutationResponse } from './../shared/models/mutation.response.model';
import { Usuarios } from './../usuarios/usuarios.entity';
import { AuthGuard, DEFAULT_GRAPHQL_CONTEXT } from './../shared/helpers/auth.guard';
import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ContaComprobarValoresService } from './conta-comprobar-valores.service';
import { ComprobarValoresEntity } from './conta-comprobar-valores.entity';
import { ComprobarValoresInput, ComprobarValoresQueryResponse, ComprobarValorQueryResponse } from './conta-comprobar-valores.model';
import { UseGuards } from '@nestjs/common';

@Resolver(() => ComprobarValoresEntity)
export class ContaComprobarValoresResolver {
  constructor(private readonly contaComprobarValoresService: ContaComprobarValoresService) {}

  @Query(() => ComprobarValoresQueryResponse)
  @UseGuards(new AuthGuard())
  async getAllComprobarValores(
    @Context(DEFAULT_GRAPHQL_CONTEXT) user: Usuarios,
  ): Promise<ComprobarValoresQueryResponse> {
    return this.contaComprobarValoresService.findAll(user);
  }

  @Query(() => ComprobarValorQueryResponse)
  async getComprobarValorById(
    @Args('id', { type: () => Int }) id: number
  ): Promise<ComprobarValorQueryResponse> {
    return this.contaComprobarValoresService.findOne(id);
  }

  @Mutation(() => MutationResponse)
  @UseGuards(new AuthGuard())
  async createComprobarValor(
    @Context(DEFAULT_GRAPHQL_CONTEXT) user: Usuarios,
    @Args('comprobarValorInput') comprobarValorInput: ComprobarValoresInput
  ): Promise<MutationResponse> {
    return this.contaComprobarValoresService.create(user, comprobarValorInput);
  }

  @Mutation(() => MutationResponse)
  async updateComprobarValor(
    @Args('comprobarValorInput') comprobarValorInput: ComprobarValoresInput
  ): Promise<MutationResponse> {
    return this.contaComprobarValoresService.update(comprobarValorInput);
  }

  @Mutation(() => MutationResponse)
  async deleteComprobarValor(
    @Args('IDs', { type: () => [Int] }) IDs: number[]
  ): Promise<MutationResponse> {
    return this.contaComprobarValoresService.delete(IDs);
  }
}
