import { Usuarios } from './../usuarios/usuarios.entity';
import { SupervisoresQueryResponse, SupervisorQueryResponse, SupervisorInput } from './supervisores.model';
import { SupervisoresService } from './supervisores.service';
import { Supervisor } from './supervisores.entity';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard, DEFAULT_GRAPHQL_CONTEXT } from './../shared/helpers/auth.guard';

@Resolver(of => Supervisor)
export class SupervisoresResolver {
    constructor(
        private _supervisorService: SupervisoresService
    ) {}

    @Query(() => SupervisoresQueryResponse)
    @UseGuards(new AuthGuard())
    async getAllSupervisores(@Context(DEFAULT_GRAPHQL_CONTEXT) user: Usuarios): Promise<SupervisoresQueryResponse> {
        return this._supervisorService.getAllSupervisores(user);
    }

    @Query(() => SupervisorQueryResponse)
    // @UseGuards(new AuthGuard())
    async getSupervisorById(
        @Args({ name: 'id', type: () => Int }) id: number
    ): Promise<SupervisorQueryResponse> {
        return this._supervisorService.getSupervisorById(id);
    }

    @Mutation(() => SupervisorQueryResponse)
    @UseGuards(new AuthGuard())
    async saveSupervisor(
        @Args({ name: 'supervisorInfo', type: () => SupervisorInput }) supervisorInfo: SupervisorInput
    ): Promise<SupervisorQueryResponse> {
        return this._supervisorService.saveSupervisor(supervisorInfo);
    }

    @Mutation(() => SupervisorQueryResponse)
    @UseGuards(new AuthGuard())
    async deleteSupervisor(
        @Args({ name: 'id', type: () => Int }) id: number
    ): Promise<SupervisorQueryResponse> {
        return this._supervisorService.deleteSupervisor(id);
    }
}
