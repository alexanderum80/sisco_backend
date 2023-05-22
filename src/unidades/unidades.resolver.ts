import { DEFAULT_GRAPHQL_CONTEXT } from './../shared/models/jwt.model';
import { UsuariosEntity } from './../usuarios/usuarios.entity';
import { UnidadesService } from './unidades.service';
import { CentrosView, UnidadesEntity } from './unidades.entity';
import { Args, Context, Int, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../shared/guards/auth.guard';

@Resolver(() => UnidadesEntity)
export class UnidadesResolver {
  constructor(private _unidadesService: UnidadesService) {}

  @Query(() => [CentrosView])
  @UseGuards(new AuthGuard())
  async getAllUnidades(): Promise<CentrosView[]> {
    return this._unidadesService.getAllUnidades();
  }

  @Query(() => [CentrosView])
  @UseGuards(new AuthGuard())
  async getAllUnidadesByUsuario(@Context(DEFAULT_GRAPHQL_CONTEXT) user: UsuariosEntity): Promise<CentrosView[]> {
    return this._unidadesService.getAllUnidades(user);
  }

  @Query(() => [CentrosView])
  @UseGuards(new AuthGuard())
  async getUnidadesByIdSubdivision(@Args({ name: 'idSubdivision', type: () => Int }) idSubdivision: number): Promise<CentrosView[]> {
    return this._unidadesService.getUnidadesByIdSubdivision(idSubdivision);
  }

  @Query(() => [CentrosView])
  @UseGuards(new AuthGuard())
  async getUnidadesByIdDivision(@Args({ name: 'idDivision', type: () => Int }) idDivision: number): Promise<CentrosView[]> {
    return this._unidadesService.getUnidadesByIdDivision(idDivision);
  }
}
