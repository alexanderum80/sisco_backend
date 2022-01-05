import { Usuarios } from './../usuarios/usuarios.entity';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { EmpleadosQueryResponse, EmpleadoQueryResponse, EmpleadoInput } from './empleados.model';
import { EmpleadosService } from './empleados.service';
import { Empleado } from './empleados.entity';
import { Args, Query, Resolver, Int, Mutation, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard, DEFAULT_GRAPHQL_CONTEXT } from './../shared/helpers/auth.guard';

@Resolver(of => Empleado)
export class EmpleadosResolver {
    constructor(
        private _empleadosService: EmpleadosService
    ) {}

    @Query(() => EmpleadosQueryResponse)
    // @UseGuards(new AuthGuard())
    async getAllEmpleados(@Context(DEFAULT_GRAPHQL_CONTEXT) user: Usuarios): Promise<EmpleadosQueryResponse> {
        return this._empleadosService.getAllEmpleados(user);
    }

    @Query(() => EmpleadoQueryResponse)
    @UseGuards(new AuthGuard())
    async getEmpleadoById(
        @Args({ name: 'id', type: () => Int }) _id: number
    ): Promise<EmpleadoQueryResponse> {
        return this._empleadosService.getEmpleadoById(_id);
    }

    @Mutation(() => MutationResponse)
    @UseGuards(new AuthGuard())
    async saveEmpleado(
        @Args({ name: 'empleadoInfo', type: () => EmpleadoInput }) empleadoInfo: EmpleadoInput
    ): Promise<MutationResponse> {
        return this._empleadosService.saveEmpleado(empleadoInfo);
    }

    @Mutation(() => MutationResponse)
    @UseGuards(new AuthGuard())
    async deleteEmpleado(
        @Args({ name: 'id', type: () => Int }) _id: number
    ): Promise<MutationResponse> {
        return this._empleadosService.deleteEmpleado(_id);
    }
}
