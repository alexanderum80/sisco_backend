import { ConciliaContaInput, ConciliaContabilidadQueryResponse, IniciarSaldosInput } from './concilia-conta.model';
import { ConciliaContaService } from './concilia-conta.service';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class ConciliaContaResolver {
    constructor(
        private conciliaContaSvc: ConciliaContaService
    ) {}

    @Query(() => ConciliaContabilidadQueryResponse)
    async conciliaContabilidad(
        @Args({ name: 'conciliaContaInput', type: () => ConciliaContaInput }) conciliaContaInput: ConciliaContaInput
    ): Promise<ConciliaContabilidadQueryResponse> {
        return this.conciliaContaSvc.conciliaContabilidad(conciliaContaInput);
    }

    @Mutation(() => ConciliaContabilidadQueryResponse)
    async iniciarSaldos(
        @Args({ name: 'iniciarSaldosInput', type: () => IniciarSaldosInput }) iniciarSaldosInput: IniciarSaldosInput,
    ): Promise<ConciliaContabilidadQueryResponse> {
        return this.conciliaContaSvc.iniciarSaldos(iniciarSaldosInput);
    }
}
