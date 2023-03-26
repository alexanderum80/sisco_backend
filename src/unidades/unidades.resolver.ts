import { DEFAULT_GRAPHQL_CONTEXT } from './../shared/models/jwt.model';
import { Usuarios } from './../usuarios/usuarios.entity';
import { AllUnidadesQueryResponse } from './unidades.model';
import { UnidadesService } from './unidades.service';
import { Unidades } from './unidades.entity';
import { Args, Context, Int, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../shared/guards/auth.guard';

@Resolver(() => Unidades)
export class UnidadesResolver {
  constructor(private _unidadesService: UnidadesService) {}

  @Query(() => AllUnidadesQueryResponse)
  @UseGuards(new AuthGuard())
  async getAllUnidades(): Promise<AllUnidadesQueryResponse> {
    return this._unidadesService.getAllUnidades();
  }

  @Query(() => AllUnidadesQueryResponse)
  @UseGuards(new AuthGuard())
  async getAllUnidadesByUsuario(@Context(DEFAULT_GRAPHQL_CONTEXT) user: Usuarios): Promise<AllUnidadesQueryResponse> {
    return this._unidadesService.getAllUnidades(user);
  }

  @Query(() => AllUnidadesQueryResponse)
  @UseGuards(new AuthGuard())
  async getUnidadesByIdSubdivision(@Args({ name: 'idSubdivision', type: () => Int }) idSubdivision: number): Promise<AllUnidadesQueryResponse> {
    return this._unidadesService.getUnidadesByIdSubdivision(idSubdivision);
  }

  @Query(() => AllUnidadesQueryResponse)
  @UseGuards(new AuthGuard())
  async getUnidadesByIdDivision(@Args({ name: 'idDivision', type: () => Int }) idDivision: number): Promise<AllUnidadesQueryResponse> {
    return this._unidadesService.getUnidadesByIdDivision(idDivision);
  }
}
