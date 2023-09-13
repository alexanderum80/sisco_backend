import { DEFAULT_GRAPHQL_CONTEXT } from './../shared/models/jwt.model';
import { UsuariosEntity } from './../usuarios/usuarios.entity';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { EmpleadosQueryResponse, EmpleadoQueryResponse, EmpleadoInput } from './empleados.model';
import { EmpleadosService } from './empleados.service';
import { Empleado } from './empleados.entity';
import { Args, Query, Resolver, Int, Mutation, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../shared/guards/auth.guard';

@Resolver(() => Empleado)
export class EmpleadosResolver {
  constructor(private _empleadosService: EmpleadosService) {}

  @Query(() => EmpleadosQueryResponse)
  @UseGuards(new AuthGuard())
  async getAllEmpleados(@Context(DEFAULT_GRAPHQL_CONTEXT) user: UsuariosEntity): Promise<EmpleadosQueryResponse> {
    return this._empleadosService.findAll(user);
  }

  @Query(() => EmpleadosQueryResponse)
  @UseGuards(new AuthGuard())
  async getEmpleadosByIdDivision(@Args({ name: 'idDivision', type: () => Int }) _idDivision: number): Promise<EmpleadosQueryResponse> {
    return this._empleadosService.findAllByIdDivision(_idDivision);
  }

  @Query(() => EmpleadoQueryResponse)
  @UseGuards(new AuthGuard())
  async getEmpleadoById(@Args({ name: 'id', type: () => Int }) _id: number): Promise<EmpleadoQueryResponse> {
    return this._empleadosService.findOne(_id);
  }

  @Mutation(() => MutationResponse)
  @UseGuards(new AuthGuard())
  async createEmpleado(@Args({ name: 'empleadoInfo', type: () => EmpleadoInput }) empleadoInfo: EmpleadoInput): Promise<MutationResponse> {
    return this._empleadosService.create(empleadoInfo);
  }

  @Mutation(() => MutationResponse)
  @UseGuards(new AuthGuard())
  async updateEmpleado(@Args({ name: 'empleadoInfo', type: () => EmpleadoInput }) empleadoInfo: EmpleadoInput): Promise<MutationResponse> {
    return this._empleadosService.update(empleadoInfo);
  }

  @Mutation(() => MutationResponse)
  @UseGuards(new AuthGuard())
  async deleteEmpleado(@Args({ name: 'IDs', type: () => [Int] }) IDs: number[]): Promise<MutationResponse> {
    return this._empleadosService.delete(IDs);
  }
}
