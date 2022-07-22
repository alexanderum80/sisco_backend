import { ActFijosClasificadorCnmbInput } from './actfijos-clasificador-cnmb.input';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ActfijosClasificadorCnmbService } from './actfijos-clasificador-cnmb.service';
import { ActFijosClasificadorCnmbEntity } from './actfijos-clasificador-cnmb.entity';

@Resolver(() => ActFijosClasificadorCnmbEntity)
export class ActfijosClasificadorCnmbResolver {
    constructor(private readonly actfijosClasificadorCnmbService: ActfijosClasificadorCnmbService) {}

    @Query(() => [ActFijosClasificadorCnmbEntity], { name: 'getAllActFijosClasificadorCnmb' })
    async findAll(): Promise<ActFijosClasificadorCnmbEntity[]> {
        return this.actfijosClasificadorCnmbService.findAll();
    }

    @Query(() => ActFijosClasificadorCnmbEntity, { name: 'getActFijosClasificadorCnmb' })
    async findOne(@Args('cnmb') cnmb: string): Promise<ActFijosClasificadorCnmbEntity> {
        return this.actfijosClasificadorCnmbService.findOne(cnmb);
    }

    @Mutation(() => ActFijosClasificadorCnmbEntity)
    async saveActFijosClasificadorCnmb(
        @Args('actfijosClasificadorCnmbInput') actfijosClasificadorCnmbInput: ActFijosClasificadorCnmbInput,
    ): Promise<ActFijosClasificadorCnmbEntity> {
        return this.actfijosClasificadorCnmbService.save(actfijosClasificadorCnmbInput);
    }

    @Mutation(() => Number)
    async removeActFijosClasificadorCnmb(@Args('cnmb') cnmb: string): Promise<number> {
        return this.actfijosClasificadorCnmbService.remove(cnmb);
    }
}
