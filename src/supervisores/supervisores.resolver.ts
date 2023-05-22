import { DEFAULT_GRAPHQL_CONTEXT } from './../shared/models/jwt.model';
import { UsuariosEntity } from './../usuarios/usuarios.entity';
import { SupervisoresQueryResponse, SupervisorQueryResponse, SupervisorInput } from './supervisores.model';
import { SupervisoresService } from './supervisores.service';
import { Supervisor } from './supervisores.entity';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../shared/guards/auth.guard';

@Resolver(() => Supervisor)
export class SupervisoresResolver {
  constructor(private _supervisorService: SupervisoresService) {}

  @Query(() => SupervisoresQueryResponse)
  @UseGuards(new AuthGuard())
  async getAllSupervisores(@Context(DEFAULT_GRAPHQL_CONTEXT) user: UsuariosEntity): Promise<SupervisoresQueryResponse> {
    return this._supervisorService.findAll(user);
  }

  @Query(() => SupervisoresQueryResponse)
  @UseGuards(new AuthGuard())
  async getSupervisoresByIdDivision(@Args({ name: 'idDivision', type: () => Int }) idDivision: number): Promise<SupervisoresQueryResponse> {
    return this._supervisorService.findAllByIdDivision(idDivision);
  }

  @Query(() => SupervisorQueryResponse)
  @UseGuards(new AuthGuard())
  async getSupervisorById(@Args({ name: 'id', type: () => Int }) id: number): Promise<SupervisorQueryResponse> {
    return this._supervisorService.findOne(id);
  }

  @Mutation(() => SupervisorQueryResponse)
  @UseGuards(new AuthGuard())
  async createSupervisor(@Args({ name: 'supervisorInfo', type: () => SupervisorInput }) supervisorInfo: SupervisorInput): Promise<SupervisorQueryResponse> {
    return this._supervisorService.create(supervisorInfo);
  }

  @Mutation(() => SupervisorQueryResponse)
  @UseGuards(new AuthGuard())
  async updateSupervisor(@Args({ name: 'supervisorInfo', type: () => SupervisorInput }) supervisorInfo: SupervisorInput): Promise<SupervisorQueryResponse> {
    return this._supervisorService.update(supervisorInfo);
  }

  @Mutation(() => SupervisorQueryResponse)
  @UseGuards(new AuthGuard())
  async deleteSupervisor(@Args({ name: 'IDs', type: () => [Int] }) IDs: number[]): Promise<SupervisorQueryResponse> {
    return this._supervisorService.delete(IDs);
  }
}
