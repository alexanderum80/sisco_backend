import { Usuarios } from './../usuarios/usuarios.entity';
import { AuthGuard, DEFAULT_GRAPHQL_CONTEXT } from './../shared/helpers/auth.guard';
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

    @Mutation(() => ConciliaContabilidadQueryResponse)
    async iniciarSaldos(@Args({ name: 'iniciarSaldosInput', type: () => IniciarSaldosInput }) iniciarSaldosInput: IniciarSaldosInput): Promise<ConciliaContabilidadQueryResponse> {
        return this.conciliaContaSvc.iniciarSaldos(iniciarSaldosInput);
    }

    @Mutation(() => ConciliaContaQueryResponse)
    async chequearCentros(
        @Args({ name: 'chequearCentrosInput', type: () => ChequearCentrosInput }) chequearCentrosInput: ChequearCentrosInput,
    ): Promise<ConciliaContaQueryResponse> {
        return this.conciliaContaSvc.chequearCentro(chequearCentrosInput);
    }

    @Mutation(() => ConciliaContaQueryResponse)
    async arreglaClasificadorCuenta(
        @Args({ name: 'idUnidad', type: () => Int }) idUnidad: number,
        @Args({ name: 'tipoUnidad', type: () => String }) tipoUnidad: string,
        @Args({ name: 'annio', type: () => String }) annio: string,
    ): Promise<ConciliaContaQueryResponse> {
        return this.conciliaContaSvc.arreglaClasificadorCuenta(idUnidad, tipoUnidad, annio);
    }
}
