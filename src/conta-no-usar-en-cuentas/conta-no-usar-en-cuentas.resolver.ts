import { DEFAULT_GRAPHQL_CONTEXT } from './../shared/models/jwt.model';
import { UsuariosEntity } from './../usuarios/usuarios.entity';
import { AuthGuard } from '../shared/guards/auth.guard';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { ContaNoUsarEnCuentasService } from './conta-no-usar-en-cuentas.service';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ContaNoUsarEnCuentasQueryResponse, ContaNoUsarEnCuentaQueryResponse, ContaNoUsarEnCuentaInput } from './conta-no-usar-en-cuenta.model';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class ContaNoUsarEnCuentasResolver {
  constructor(private _noUsarEnCuentaSvc: ContaNoUsarEnCuentasService) {}

  @Query(() => ContaNoUsarEnCuentasQueryResponse)
  @UseGuards(new AuthGuard())
  async getAllNoUsarEnCuenta(@Context(DEFAULT_GRAPHQL_CONTEXT) user: UsuariosEntity): Promise<ContaNoUsarEnCuentasQueryResponse> {
    return this._noUsarEnCuentaSvc.findAll(user);
  }

  @Query(() => ContaNoUsarEnCuentaQueryResponse)
  @UseGuards(new AuthGuard())
  async getNoUsarEnCuentaById(@Args({ name: 'id', type: () => Int }) id: number): Promise<ContaNoUsarEnCuentaQueryResponse> {
    return this._noUsarEnCuentaSvc.findOne(id);
  }

  @Mutation(() => MutationResponse)
  @UseGuards(new AuthGuard())
  async createNoUsarEnCuenta(
    @Context(DEFAULT_GRAPHQL_CONTEXT) user: UsuariosEntity,
    @Args({ name: 'noUsarEnCuentaInput', type: () => ContaNoUsarEnCuentaInput }) noUsarEnCuentaInput: ContaNoUsarEnCuentaInput,
  ): Promise<MutationResponse> {
    return this._noUsarEnCuentaSvc.create(user, noUsarEnCuentaInput);
  }

  @Mutation(() => MutationResponse)
  async updateNoUsarEnCuenta(
    @Args({ name: 'noUsarEnCuentaInput', type: () => ContaNoUsarEnCuentaInput }) noUsarEnCuentaInput: ContaNoUsarEnCuentaInput,
  ): Promise<MutationResponse> {
    return this._noUsarEnCuentaSvc.update(noUsarEnCuentaInput);
  }

  @Mutation(() => MutationResponse)
  async deleteNoUsarEnCuenta(@Args({ name: 'IDs', type: () => [Int] }) IDs: number[]): Promise<MutationResponse> {
    return this._noUsarEnCuentaSvc.delete(IDs);
  }
}
