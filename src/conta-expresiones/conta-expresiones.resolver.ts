import { DEFAULT_GRAPHQL_CONTEXT } from './../shared/models/jwt.model';
import { UsuariosEntity } from './../usuarios/usuarios.entity';
import { AuthGuard } from '../shared/guards/auth.guard';
import { ExpresionesResumenEntity, ExpresionesDetalleEntity } from './conta-expresiones.entity';
import { Args, Int, Mutation, Query, Resolver, Context } from '@nestjs/graphql';
import { ContaExpresionInput } from './conta-expresiones.model';
import { ContaExpresionesService } from './conta-expresiones.service';
import { MutationResponse } from '../shared/models/mutation.response.model';
import { UseGuards } from '@nestjs/common';

@Resolver(() => ExpresionesResumenEntity)
export class ContaExpresionesResumenResolver {
  constructor(private expresionesSvc: ContaExpresionesService) {}

  @Query(() => [ExpresionesResumenEntity])
  @UseGuards(new AuthGuard())
  async getAllExpresionesResumen(@Context(DEFAULT_GRAPHQL_CONTEXT) user: UsuariosEntity): Promise<ExpresionesResumenEntity[]> {
    return this.expresionesSvc.findAllResumen(user);
  }

  @Query(() => ExpresionesResumenEntity)
  async getExpresionResumenById(@Args({ name: 'id', type: () => Int }) id: number): Promise<ExpresionesResumenEntity> {
    return this.expresionesSvc.findOneResumen(id);
  }

  @Mutation(() => MutationResponse)
  @UseGuards(new AuthGuard())
  async createExpresion(
    @Context(DEFAULT_GRAPHQL_CONTEXT) user: UsuariosEntity,
    @Args({ name: 'expresionInput', type: () => ContaExpresionInput }) expresionInput: ContaExpresionInput,
  ): Promise<MutationResponse> {
    return this.expresionesSvc.create(user, expresionInput);
  }

  @Mutation(() => MutationResponse)
  async updateExpresion(@Args({ name: 'expresionInput', type: () => ContaExpresionInput }) expresionInput: ContaExpresionInput): Promise<MutationResponse> {
    return this.expresionesSvc.update(expresionInput);
  }

  @Mutation(() => MutationResponse)
  async deleteExpresionResumen(@Args({ name: 'IDs', type: () => [Int] }) IDs: number[]): Promise<MutationResponse> {
    return this.expresionesSvc.deleteResumen(IDs);
  }
}

@Resolver(() => ExpresionesDetalleEntity)
export class ContaExpresionesDetalleResolver {
  constructor(private expresionesSvc: ContaExpresionesService) {}

  @Query(() => [ExpresionesDetalleEntity])
  async getAllExpresionesDetalle(): Promise<ExpresionesDetalleEntity[]> {
    return this.expresionesSvc.findAllDetalle();
  }

  @Query(() => [ExpresionesDetalleEntity])
  async getExpresionesDetalleByIdResumen(@Args({ name: 'idResumen', type: () => Int }) idResumen: number): Promise<ExpresionesDetalleEntity[]> {
    return this.expresionesSvc.findOneDetalleByResumen(idResumen);
  }

  @Query(() => ExpresionesDetalleEntity)
  async getExpresionDetalleById(@Args({ name: 'id', type: () => Int }) id: number): Promise<ExpresionesDetalleEntity> {
    return this.expresionesSvc.findOneDetalle(id);
  }

  @Mutation(() => MutationResponse)
  async deleteExpresionDetalle(@Args({ name: 'id', type: () => [Int] }) id: number[]): Promise<MutationResponse> {
    return this.expresionesSvc.deleteDetalle(id);
  }
}
