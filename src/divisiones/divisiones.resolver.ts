import { DEFAULT_GRAPHQL_CONTEXT } from './../shared/models/jwt.model';
import { UsuariosEntity } from './../usuarios/usuarios.entity';
import { DivisionesService } from './divisiones.service';
import { DivisionesEntity } from './divisiones.entity';
import { Resolver, Query, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../shared/guards/auth.guard';

@Resolver(() => DivisionesEntity)
export class DivisionesResolver {
  constructor(private _divisionesService: DivisionesService) {}

  @Query(() => [DivisionesEntity])
  // @UseGuards(new AuthGuard())
  async getAllDivisiones(): Promise<DivisionesEntity[]> {
    return this._divisionesService.getAllDivisiones();
  }

  @Query(() => [DivisionesEntity])
  @UseGuards(new AuthGuard())
  async getAllDivisionesByUsuario(@Context(DEFAULT_GRAPHQL_CONTEXT) user: UsuariosEntity): Promise<DivisionesEntity[]> {
    return this._divisionesService.getAllDivisiones(user);
  }

  @Query(() => [DivisionesEntity])
  @UseGuards(new AuthGuard())
  async getDivisionById(@Args({ name: 'id', type: () => Int }) id: number): Promise<DivisionesEntity[]> {
    return this._divisionesService.getDivisionById(id);
  }
}
