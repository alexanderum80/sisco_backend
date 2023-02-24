import { ActFijosClasificadorSubgrupoEntity } from './entities/actfijos-clasificador-subgrupo.entity';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ActfijosClasificadorSubgruposService } from './actfijos-clasificador-subgrupos.service';
import { ActFijosClasificadorSubgrupoInput } from './dto/actfijos-clasificador-subgrupo.input';

@Resolver(() => ActFijosClasificadorSubgrupoEntity)
export class ActfijosClasificadorSubgruposResolver {
  constructor(private readonly actfijosClasificadorSubgruposService: ActfijosClasificadorSubgruposService) {}

  @Query(() => [ActFijosClasificadorSubgrupoEntity], { name: 'getAllActFijosClasificadorSubgrupo' })
  async findAll(): Promise<ActFijosClasificadorSubgrupoEntity[]> {
    return this.actfijosClasificadorSubgruposService.findAll();
  }

  @Query(() => ActFijosClasificadorSubgrupoEntity, { name: 'getActFijosClasificadorSubgrupo' })
  async findOne(@Args('grupo', { type: () => Int }) grupo: number, @Args('codigo', { type: () => Int }) codigo: number): Promise<ActFijosClasificadorSubgrupoEntity> {
    return this.actfijosClasificadorSubgruposService.findOne(grupo, codigo);
  }

  @Mutation(() => ActFijosClasificadorSubgrupoEntity)
  async saveActFijosClasificadorSubgrupo(
    @Args('actFijosClasificadorSubgrupoInput') actFijosClasificadorSubgrupoInput: ActFijosClasificadorSubgrupoInput,
  ): Promise<ActFijosClasificadorSubgrupoEntity> {
    return this.actfijosClasificadorSubgruposService.save(actFijosClasificadorSubgrupoInput);
  }

  @Mutation(() => Int)
  async deleteActFijosClasificadorSubgrupo(@Args('grupo', { type: () => Int }) grupo: number, @Args('codigo', { type: () => Int }) codigo: number): Promise<number> {
    return this.actfijosClasificadorSubgruposService.remove(grupo, codigo);
  }
}
