import { DEFAULT_GRAPHQL_CONTEXT } from './../shared/models/jwt.model';
import { Usuarios } from './../usuarios/usuarios.entity';
import { AuthGuard } from '../shared/guards/auth.guard';
import { ConciliaContaInput, ConciliaContabilidadQueryResponse, IniciarSaldosInput, ChequearCentrosInput, ConciliaContaQueryResponse } from './concilia-conta.model';
import { ConciliaContaService } from './concilia-conta.service';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class ConciliaContaResolver {
  constructor(private conciliaContaSvc: ConciliaContaService) {}

  @Query(() => ConciliaContabilidadQueryResponse)
  @UseGuards(new AuthGuard())
  async conciliaContabilidad(
    @Context(DEFAULT_GRAPHQL_CONTEXT) user: Usuarios,
    @Args({ name: 'conciliaContaInput', type: () => ConciliaContaInput }) conciliaContaInput: ConciliaContaInput,
  ): Promise<ConciliaContabilidadQueryResponse> {
    return this.conciliaContaSvc.conciliaContabilidad(user, conciliaContaInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(new AuthGuard())
  async iniciarSaldos(
    @Context(DEFAULT_GRAPHQL_CONTEXT) user: Usuarios,
    @Args({ name: 'iniciarSaldosInput', type: () => IniciarSaldosInput }) iniciarSaldosInput: IniciarSaldosInput,
  ): Promise<boolean> {
    return this.conciliaContaSvc.iniciarSaldos(user, iniciarSaldosInput);
  }

  @Mutation(() => ConciliaContaQueryResponse)
  @UseGuards(new AuthGuard())
  async chequearCentros(@Args({ name: 'chequearCentrosInput', type: () => ChequearCentrosInput }) chequearCentrosInput: ChequearCentrosInput): Promise<ConciliaContaQueryResponse> {
    return this.conciliaContaSvc.chequearCentro(chequearCentrosInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(new AuthGuard())
  async arreglaClasificadorCuenta(
    @Context(DEFAULT_GRAPHQL_CONTEXT) user: Usuarios,
    @Args({ name: 'idUnidad', type: () => Int }) idUnidad: number,
    @Args({ name: 'tipoUnidad', type: () => String }) tipoUnidad: string,
    @Args({ name: 'annio', type: () => String }) annio: string,
  ): Promise<boolean> {
    return this.conciliaContaSvc.arreglaClasificadorCuenta(user, idUnidad, tipoUnidad, annio);
  }
}
