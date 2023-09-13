import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ContaClaseCuentaService } from './conta-clase-cuenta.service';
import { ClaseCuentaEntity } from './entities/conta-clase-cuenta.entity';

@Resolver(() => ClaseCuentaEntity)
export class ContaClaseCuentaResolver {
  constructor(private readonly contaClaseCuentaService: ContaClaseCuentaService) {}

  @Query(() => [ClaseCuentaEntity], { name: 'getAllClaseCuenta' })
  async findAll(): Promise<ClaseCuentaEntity[]> {
    return this.contaClaseCuentaService.findAll();
  }

  @Query(() => ClaseCuentaEntity, { name: 'getClaseCuentaById' })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<ClaseCuentaEntity> {
    return this.contaClaseCuentaService.findOne(id);
  }

  @Query(() => [ClaseCuentaEntity], { name: 'getClaseCuentaByIdGrupo' })
  async findByIdGrupo(@Args('idGrupo', { type: () => String }) idGrupo: string): Promise<ClaseCuentaEntity[]> {
    return this.contaClaseCuentaService.findByGrupo(idGrupo);
  }
}
