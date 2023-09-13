import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ContaInformeCtasCobrarPagarService } from './conta-informe-ctas-cobrar-pagar.service';
import { ContaInformeCtasCobrarPagarView } from './entities/conta-informe-ctas-cobrar-pagar.entity';

@Resolver(() => ContaInformeCtasCobrarPagarView)
export class ContaInformeCtasCobrarPagarResolver {
  constructor(private readonly contaInformeCtasCobrarPagarService: ContaInformeCtasCobrarPagarService) {}

  @Query(() => [ContaInformeCtasCobrarPagarView], { name: 'contaInformeCtasCobrarPagar' })
  async findAll(
    @Args({ name: 'idDivision', type: () => Int }) idDivision: number,
    @Args({ name: 'annio', type: () => Int }) annio: number,
    @Args({ name: 'periodo', type: () => Int }) periodo: number,
  ): Promise<ContaInformeCtasCobrarPagarView[]> {
    return this.contaInformeCtasCobrarPagarService.findAll(idDivision, annio, periodo);
  }
}
