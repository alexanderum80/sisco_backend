import { DEFAULT_GRAPHQL_CONTEXT } from './../shared/models/jwt.model';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { UsuariosEntity } from './../usuarios/usuarios.entity';
import { AuthGuard } from '../shared/guards/auth.guard';
import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ContaComprobarValoresService } from './conta-comprobar-valores.service';
import { ComprobarValoresEntity } from './conta-comprobar-valores.entity';
import { ComprobarValoresInput } from './conta-comprobar-valores.model';
import { UseGuards } from '@nestjs/common';

@Resolver(() => ComprobarValoresEntity)
export class ContaComprobarValoresResolver {
  constructor(private readonly contaComprobarValoresService: ContaComprobarValoresService) {}

  @Query(() => [ComprobarValoresEntity])
  @UseGuards(new AuthGuard())
  async getAllComprobarValores(@Context(DEFAULT_GRAPHQL_CONTEXT) user: UsuariosEntity): Promise<ComprobarValoresEntity[]> {
    return this.contaComprobarValoresService.findAll(user);
  }

  @Query(() => ComprobarValoresEntity)
  async getComprobarValorById(@Args('id', { type: () => Int }) id: number): Promise<ComprobarValoresEntity> {
    return this.contaComprobarValoresService.findOne(id);
  }

  @Mutation(() => MutationResponse)
  @UseGuards(new AuthGuard())
  async createComprobarValor(
    @Context(DEFAULT_GRAPHQL_CONTEXT) user: UsuariosEntity,
    @Args('comprobarValorInput') comprobarValorInput: ComprobarValoresInput,
  ): Promise<MutationResponse> {
    return this.contaComprobarValoresService.create(user, comprobarValorInput);
  }

  @Mutation(() => MutationResponse)
  async updateComprobarValor(@Args('comprobarValorInput') comprobarValorInput: ComprobarValoresInput): Promise<MutationResponse> {
    return this.contaComprobarValoresService.update(comprobarValorInput);
  }

  @Mutation(() => MutationResponse)
  async deleteComprobarValor(@Args('IDs', { type: () => [Int] }) IDs: number[]): Promise<MutationResponse> {
    return this.contaComprobarValoresService.delete(IDs);
  }
}
