import { Usuarios } from './../usuarios/usuarios.entity';
import { AllUnidadesQueryResponse } from './unidades.model';
import { UnidadesService } from './unidades.service';
import { Unidades } from './unidades.entity';
import { Args, Context, Int, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard, DEFAULT_GRAPHQL_CONTEXT } from '../shared/helpers/auth.guard';

@Resolver(of => Unidades)
export class UnidadesResolver {
    constructor(
        private _unidadesService: UnidadesService
    ) {}

    @Query(() => AllUnidadesQueryResponse)
    @UseGuards(new AuthGuard())
    async getAllUnidades(@Context(DEFAULT_GRAPHQL_CONTEXT) user: Usuarios): Promise<AllUnidadesQueryResponse> {
        return this._unidadesService.getAllUnidades(user);
    }

    @Query(() => AllUnidadesQueryResponse)
    // @UseGuards(new AuthGuard())
    async getUnidadesByIdDivision(
        @Args({ name: 'idDivision', type: () => Int }) idDivision: number
    ): Promise<AllUnidadesQueryResponse> {
        return this._unidadesService.getUnidadesByIdDivision(idDivision);
    }
}
