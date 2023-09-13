import { DEFAULT_GRAPHQL_CONTEXT } from './../shared/models/jwt.model';
import { UsuariosEntity } from './../usuarios/usuarios.entity';
import { AuthGuard } from '../shared/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { ContaComprobarExpresionesEntity } from './conta-comprobar-expresiones.entity';
import { ContaComprobarExpresionesInput } from './conta-comprobar-expresiones.model';
import { ContaComprobarExpresionesService } from './conta-comprobar-expresiones.service';

@Resolver(() => ContaComprobarExpresionesEntity)
export class ContaComprobarExpresionesResolver {
  constructor(private _comprobarExpresionesSvc: ContaComprobarExpresionesService) {}

  @Query(() => [ContaComprobarExpresionesEntity])
  @UseGuards(new AuthGuard())
  async getAllComprobarExpresiones(@Context(DEFAULT_GRAPHQL_CONTEXT) user: UsuariosEntity): Promise<ContaComprobarExpresionesEntity[]> {
    return this._comprobarExpresionesSvc.findAll(user);
  }

  @Query(() => ContaComprobarExpresionesEntity)
  @UseGuards(new AuthGuard())
  async getComprobarExpresionById(@Args({ name: 'id', type: () => Int }) id: number): Promise<ContaComprobarExpresionesEntity> {
    return this._comprobarExpresionesSvc.findOne(id);
  }

  @Mutation(() => MutationResponse)
  @UseGuards(new AuthGuard())
  async createComprobarExpresion(
    @Context(DEFAULT_GRAPHQL_CONTEXT) user: UsuariosEntity,
    @Args({ name: 'comprobarExpresionInput', type: () => ContaComprobarExpresionesInput }) comprobarExpresionInput: ContaComprobarExpresionesInput,
  ): Promise<MutationResponse> {
    return this._comprobarExpresionesSvc.create(user, comprobarExpresionInput);
  }

  @Mutation(() => MutationResponse)
  @UseGuards(new AuthGuard())
  async updateComprobarExpresion(
    @Args({ name: 'comprobarExpresionInput', type: () => ContaComprobarExpresionesInput }) comprobarExpresionInput: ContaComprobarExpresionesInput,
  ): Promise<MutationResponse> {
    return this._comprobarExpresionesSvc.update(comprobarExpresionInput);
  }

  @Mutation(() => MutationResponse)
  @UseGuards(new AuthGuard())
  async deleteComprobarExpresion(@Args({ name: 'IDs', type: () => [Int] }) IDs: number[]): Promise<MutationResponse> {
    return this._comprobarExpresionesSvc.delete(IDs);
  }
}
