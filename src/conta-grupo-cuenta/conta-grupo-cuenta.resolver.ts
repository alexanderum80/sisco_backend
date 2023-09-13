import { Resolver, Query, Args } from '@nestjs/graphql';
import { ContaGrupoCuentaService } from './conta-grupo-cuenta.service';
import { GrupoCuentaEntity } from './entities/conta-grupo-cuenta.entity';

@Resolver(() => GrupoCuentaEntity)
export class ContaGrupoCuentaResolver {
  constructor(private readonly contaGrupoCuentaService: ContaGrupoCuentaService) {}

  @Query(() => [GrupoCuentaEntity], { name: 'getAllGrupoCuenta' })
  async findAll(): Promise<GrupoCuentaEntity[]> {
    return this.contaGrupoCuentaService.findAll();
  }

  @Query(() => GrupoCuentaEntity, { name: 'getGrupoCuentaById' })
  async findOne(@Args('id', { type: () => String }) id: string): Promise<GrupoCuentaEntity> {
    return this.contaGrupoCuentaService.findOne(id);
  }
}
