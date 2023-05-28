import { ContaEstadisticaInput } from './dto/conta-estadistica.input';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { ContaEstadisticaService } from './conta-estadistica.service';
import { ContaEstadisticaParteView, ContaEstadisticaView } from './entities/conta-estadistica.entity';

@Resolver(() => ContaEstadisticaView)
export class ContaEstadisticaResolver {
  constructor(private readonly contaEstadisticaService: ContaEstadisticaService) {}

  @Query(() => [ContaEstadisticaView], { name: 'contaEstadistica' })
  async findAll(@Args('contaEstadisticaInput', { type: () => ContaEstadisticaInput }) contaEstadisticaInput: ContaEstadisticaInput): Promise<ContaEstadisticaView[]> {
    return this.contaEstadisticaService.findAll(contaEstadisticaInput);
  }

  @Query(() => [ContaEstadisticaParteView], { name: 'contaEstadisticaParte' })
  async findAllParte(): Promise<ContaEstadisticaParteView[]> {
    return this.contaEstadisticaService.findAllParte();
  }
}
