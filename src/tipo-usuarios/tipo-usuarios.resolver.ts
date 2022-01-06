import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { TipoUsuariosService } from './tipo-usuarios.service';
import { TipoUsuarios } from './tipo-usuarios.entity';
import { TipoUsuarioQueryResponse, TipoUsuariosQueryResponse } from './tipo-usuarios.model';

@Resolver(() => TipoUsuarios)
export class TipoUsuariosResolver {
  constructor(private readonly tipoUsuariosService: TipoUsuariosService) {}

  @Query(() => TipoUsuariosQueryResponse)
  async getAllTipoUsuarios(): Promise<TipoUsuariosQueryResponse> {
    return this.tipoUsuariosService.findAll();
  }

  @Query(() => TipoUsuarioQueryResponse)
  async getTipoUsuarios(
    @Args('id', { type: () => Int }) id: number
  ): Promise<TipoUsuarioQueryResponse> {
      return this.tipoUsuariosService.findOne(id);
  }

}
