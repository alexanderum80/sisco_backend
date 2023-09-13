import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ContaCategoriaCuentaService } from './conta-categoria-cuenta.service';
import { CategoriaCuentaEntity } from './entities/conta-categoria-cuenta.entity';

@Resolver(() => CategoriaCuentaEntity)
export class ContaCategoriaCuentaResolver {
  constructor(private readonly contaCategoriaCuentaService: ContaCategoriaCuentaService) {}

  @Query(() => [CategoriaCuentaEntity], { name: 'getAllCategoriaCuenta' })
  async findAll(): Promise<CategoriaCuentaEntity[]> {
    return this.contaCategoriaCuentaService.findAll();
  }

  @Query(() => CategoriaCuentaEntity, { name: 'getCategoriaCuentaById' })
  async findOne(@Args('id', { type: () => String }) id: string): Promise<CategoriaCuentaEntity> {
    return this.contaCategoriaCuentaService.findOne(id);
  }

  @Query(() => [CategoriaCuentaEntity], { name: 'getCategoriaCuentaByIdClase' })
  async findByIdGrupo(@Args('idClase', { type: () => Int }) idClase: number): Promise<CategoriaCuentaEntity[]> {
    return this.contaCategoriaCuentaService.findByClase(idClase);
  }
}
