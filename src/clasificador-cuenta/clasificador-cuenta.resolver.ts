import { MutationResponse } from './../shared/models/mutation.response.model';
import { ClasificadorCuentasQueryResponse, ClasificadorCuentaQueryResponse, ClasificadorCuentaRealInput, CuentasAgrupadasQueryResponse } from './clasificador-cuenta.model';
import { ClasificadorCuentaService } from './clasificador-cuenta.service';
import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { ClasificadorCuentaReal } from './clasificador-cuenta.entity';

@Resolver(() => ClasificadorCuentaReal)
export class ClasificadorCuentaResolver {
    constructor(
        private clasificadorCuentaSvc: ClasificadorCuentaService
    ) {}

    @Query(() => ClasificadorCuentasQueryResponse)
    async getAllClasificadorCuentas(): Promise<ClasificadorCuentasQueryResponse> {
        return this.clasificadorCuentaSvc.getAllClasificadorCuentas();
    }

    @Query(() => ClasificadorCuentaQueryResponse)
    async getClasificadorCuenta(
        @Args('cuenta') cuenta: string,
        @Args('subcuenta') subcuenta: string,
        @Args({ name: 'tipo', type: () => Int }) tipo: number
    ): Promise<ClasificadorCuentaQueryResponse> {
        return this.clasificadorCuentaSvc.getClasificadorCuenta(cuenta, subcuenta, tipo);
    }

    @Query(() => CuentasAgrupadasQueryResponse)
    async getCuentasAgrupadas(): Promise<CuentasAgrupadasQueryResponse> {
        return this.clasificadorCuentaSvc.getCuentasAgrupadas();
    }

    @Mutation(() => MutationResponse)
    async saveClasificadorCuenta(
        @Args({ name: 'clasificadorInfo', type: () => ClasificadorCuentaRealInput }) clasificadorInfo: ClasificadorCuentaRealInput
    ): Promise<ClasificadorCuentasQueryResponse> {
        return this.clasificadorCuentaSvc.saveClasificadorCuenta(clasificadorInfo);
    }

    @Mutation(() => MutationResponse)
    async deleteClasificadorCuenta(
        @Args('cuenta') cuenta: string,
        @Args('subcuenta') subcuenta: string,
        @Args({ name: 'tipo', type: () => Int }) tipo: number
    ): Promise<ClasificadorCuentasQueryResponse> {
        return this.clasificadorCuentaSvc.deleteClasificadorCuenta(cuenta, subcuenta, tipo);
    }
}
