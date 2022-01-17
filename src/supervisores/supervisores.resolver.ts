import { Usuarios } from './../usuarios/usuarios.entity';
import { SupervisoresQueryResponse, SupervisorQueryResponse, SupervisorDTO } from './supervisores.model';
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
        return this._supervisorService.findAll(user);
    }

    @Query(() => SupervisorQueryResponse)
    @UseGuards(new AuthGuard())
    async getSupervisorById(
        @Args({ name: 'id', type: () => Int }) id: number
    ): Promise<SupervisorQueryResponse> {
        return this._supervisorService.findOne(id);
    }

    @Mutation(() => SupervisorQueryResponse)
    @UseGuards(new AuthGuard())
    async createSupervisor(
        @Args({ name: 'supervisorInfo', type: () => SupervisorDTO }) supervisorInfo: SupervisorDTO
    ): Promise<SupervisorQueryResponse> {
        return this._supervisorService.create(supervisorInfo);
    }

    @Mutation(() => SupervisorQueryResponse)
    @UseGuards(new AuthGuard())
    async updateSupervisor(
        @Args({ name: 'supervisorInfo', type: () => SupervisorDTO }) supervisorInfo: SupervisorDTO
    ): Promise<SupervisorQueryResponse> {
        return this._supervisorService.update(supervisorInfo);
    }

    @Mutation(() => SupervisorQueryResponse)
    @UseGuards(new AuthGuard())
    async deleteSupervisor(
        @Args({ name: 'IDs', type: () => [Int] }) IDs: number[]
    ): Promise<SupervisorQueryResponse> {
        return this._supervisorService.delete(IDs);
    }
}
