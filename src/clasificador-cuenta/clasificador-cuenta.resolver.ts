import { MutationResponse } from './../shared/models/mutation.response.model';
import { ClasificadorCuentaRealInput, CuentasAgrupadas } from './clasificador-cuenta.model';
import { ClasificadorCuentaService } from './clasificador-cuenta.service';
import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { ClasificadorCuentaRealEntity } from './clasificador-cuenta.entity';

@Resolver(() => ClasificadorCuentaRealEntity)
export class ClasificadorCuentaResolver {
  constructor(private clasificadorCuentaSvc: ClasificadorCuentaService) {}

  @Query(() => [ClasificadorCuentaRealEntity])
  async getAllClasificadorCuentas(@Args('tipo', { nullable: true, type: () => Int }) tipo: number): Promise<ClasificadorCuentaRealEntity[]> {
    return this.clasificadorCuentaSvc.getAllClasificadorCuentas(tipo);
  }

  @Query(() => ClasificadorCuentaRealEntity)
  async getClasificadorCuenta(
    @Args('cuenta') cuenta: string,
    @Args('subcuenta') subcuenta: string,
    @Args({ name: 'tipo', type: () => Int }) tipo: number,
  ): Promise<ClasificadorCuentaRealEntity> {
    return this.clasificadorCuentaSvc.getClasificadorCuenta(cuenta, subcuenta, tipo);
  }

  @Query(() => [CuentasAgrupadas])
  async getCuentasAgrupadas(): Promise<CuentasAgrupadas[]> {
    return this.clasificadorCuentaSvc.getCuentasAgrupadas();
  }

  @Mutation(() => MutationResponse)
  async saveClasificadorCuenta(
    @Args({ name: 'clasificadorInfo', type: () => ClasificadorCuentaRealInput }) clasificadorInfo: ClasificadorCuentaRealInput,
  ): Promise<MutationResponse> {
    return this.clasificadorCuentaSvc.saveClasificadorCuenta(clasificadorInfo);
  }

  @Mutation(() => MutationResponse)
  async deleteClasificadorCuenta(
    @Args('cuenta') cuenta: string,
    @Args('subcuenta') subcuenta: string,
    @Args({ name: 'tipo', type: () => Int }) tipo: number,
  ): Promise<MutationResponse> {
    return this.clasificadorCuentaSvc.deleteClasificadorCuenta(cuenta, subcuenta, tipo);
  }
}
