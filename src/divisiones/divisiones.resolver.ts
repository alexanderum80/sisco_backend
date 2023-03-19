import { DEFAULT_GRAPHQL_CONTEXT } from './../shared/models/jwt.model';
import { Usuarios } from './../usuarios/usuarios.entity';
import { DivisionesQueryResponse } from './divisiones.model';
import { DivisionesService } from './divisiones.service';
import { DivisionesEntity } from './divisiones.entity';
import { Resolver, Query, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../shared/helpers/auth.guard';

@Resolver(() => DivisionesEntity)
export class DivisionesResolver {
  constructor(private _divisionesService: DivisionesService) {}

  @Query(() => DivisionesQueryResponse)
  @UseGuards(new AuthGuard())
  async getAllDivisiones(): Promise<DivisionesQueryResponse> {
    return this._divisionesService.getAllDivisiones();
  }

  @Query(() => DivisionesQueryResponse)
  @UseGuards(new AuthGuard())
  async getAllDivisionesByUsuario(@Context(DEFAULT_GRAPHQL_CONTEXT) user: Usuarios): Promise<DivisionesQueryResponse> {
    return this._divisionesService.getAllDivisiones(user);
  }

  @Query(() => DivisionesQueryResponse)
  @UseGuards(new AuthGuard())
  async getDivisionById(@Args({ name: 'id', type: () => Int }) id: number): Promise<DivisionesQueryResponse> {
    return this._divisionesService.getDivisionById(id);
  }
}
