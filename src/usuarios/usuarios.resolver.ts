import { MutationResponse } from './../shared/models/mutation.response.model';
import { UsuariosQueryResponse, UsuarioInput, UsuarioQueryResponse } from './usuarios.model';
import { UsuariosService } from './usuarios.service';
import { Resolver, Query, Args, Int, Mutation, Context } from '@nestjs/graphql';
import { Usuarios } from './usuarios.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard, DEFAULT_GRAPHQL_CONTEXT } from '../shared/helpers/auth.guard';


@Resolver(() => Usuarios)
export class UsuariosResolver {
    constructor(
        protected readonly _usuariosService: UsuariosService
    ) {}

    @Query(() => UsuarioQueryResponse)
    async authenticateUsuario(
        @Args('usuario') usuario: string,
        @Args('passw') passw: string
    ): Promise<UsuarioQueryResponse> {
        return this._usuariosService.authenticate(usuario, passw);
    }

    @Query(() => UsuariosQueryResponse)
    @UseGuards(new AuthGuard())
    async getAllUsuarios(
        @Context(DEFAULT_GRAPHQL_CONTEXT) user: Usuarios
    ): Promise<UsuariosQueryResponse> {
        return this._usuariosService.findAll(user);
    }

    @Query(() => UsuarioQueryResponse)
    @UseGuards(new AuthGuard())
    async getUsuarioById(
        @Args({ name: 'id', type: () => Int }) id: number
    ): Promise<UsuarioQueryResponse> {
        return this._usuariosService.findOne(id);
    }

    @Query(() => UsuariosQueryResponse)
    @UseGuards(new AuthGuard())
    async getUsuarioByName(
        @Args('name') name: string
    ): Promise<UsuariosQueryResponse> {
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
    @UseGuards(new AuthGuard())
    async createUsuario(
        @Args('usuarioInfo') usuarioInfo: UsuarioInput
    ): Promise<MutationResponse> {
        return this._usuariosService.create(usuarioInfo);
    }

    @Mutation(() => MutationResponse)
    @UseGuards(new AuthGuard())
    async updateUsuario(
        @Args('usuarioInfo') usuarioInfo: UsuarioInput
    ): Promise<MutationResponse> {
        return this._usuariosService.update(usuarioInfo);
    }

    @Mutation(() => MutationResponse)
    @UseGuards(new AuthGuard())
    async deleteUsuario(
        @Args({ name: 'IDs', type: () => [Int] }) IDs: number[]
    ): Promise<MutationResponse> {
        return this._usuariosService.delete(IDs);
    }

}
