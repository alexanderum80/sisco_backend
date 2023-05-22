import { MutationResponse } from './../shared/models/mutation.response.model';
import { UsuariosQueryResponse, UsuarioInput, UsuarioQueryResponse } from './usuarios.model';
import { UsuariosService } from './usuarios.service';
import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { UsuariosEntity } from './usuarios.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../shared/guards/auth.guard';

@Resolver(() => UsuariosEntity)
export class UsuariosResolver {
  constructor(protected readonly _usuariosService: UsuariosService) {}

  @Query(() => UsuariosEntity)
  async authenticateUsuario(@Args('usuario') usuario: string, @Args('passw') passw: string): Promise<UsuariosEntity> {
    return this._usuariosService.authenticate(usuario, passw);
  }

  @Query(() => UsuariosEntity)
  async refreshToken(@Args('token') token: string): Promise<UsuariosEntity> {
    return this._usuariosService.refreshToken(token);
  }

  @Query(() => UsuariosQueryResponse)
  @UseGuards(new AuthGuard())
  async getAllUsuarios(): Promise<UsuariosQueryResponse> {
    return this._usuariosService.findAll();
  }

  @Query(() => UsuariosQueryResponse)
  @UseGuards(new AuthGuard())
  async getUsuariosByIdDivision(@Args({ name: 'idDivision', type: () => Int }) idDivision: number): Promise<UsuariosQueryResponse> {
    return this._usuariosService.findAllByIdDivision(idDivision);
  }

  @Query(() => UsuarioQueryResponse)
  @UseGuards(new AuthGuard())
  async getUsuarioById(@Args({ name: 'id', type: () => Int }) id: number): Promise<UsuarioQueryResponse> {
    return this._usuariosService.findOne(id);
  }

  @Query(() => UsuariosQueryResponse)
  @UseGuards(new AuthGuard())
  async getUsuarioByName(@Args('name') name: string): Promise<UsuariosQueryResponse> {
    return this._usuariosService.findByName(name);
  }

  @Mutation(() => MutationResponse)
  @UseGuards(new AuthGuard())
  async changePassword(
    @Args({ name: 'idUsuario', type: () => Int }) idUsuario: number,
    @Args({ name: 'password', type: () => String }) password: string,
  ): Promise<MutationResponse> {
    return this._usuariosService.changePassword(idUsuario, password);
  }

  @Mutation(() => MutationResponse)
  // @UseGuards(new AuthGuard())
  async createUsuario(@Args('usuarioInfo') usuarioInfo: UsuarioInput): Promise<MutationResponse> {
    return this._usuariosService.create(usuarioInfo);
  }

  @Mutation(() => MutationResponse)
  @UseGuards(new AuthGuard())
  async updateUsuario(@Args('usuarioInfo') usuarioInfo: UsuarioInput): Promise<MutationResponse> {
    return this._usuariosService.update(usuarioInfo);
  }

  @Mutation(() => MutationResponse)
  @UseGuards(new AuthGuard())
  async deleteUsuario(@Args({ name: 'IDs', type: () => [Int] }) IDs: number[]): Promise<MutationResponse> {
    return this._usuariosService.delete(IDs);
  }
}
