import { CajaConfiguracionEntity } from './caja-configuracion.entity';
import { CajaConfiguracionInput } from './caja-configuracion.model';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CajaConfiguracionService } from './caja-configuracion.service';

@Resolver(() => CajaConfiguracionEntity)
export class CajaConfiguracionResolver {
  constructor(private readonly cajaConfiguracionService: CajaConfiguracionService) {}

  @Query(() => [CajaConfiguracionEntity], { name: 'getCajasConfiguracion' })
  async findAll(): Promise<CajaConfiguracionEntity[]> {
    return this.cajaConfiguracionService.findAll();
  }

  @Query(() => CajaConfiguracionEntity, { name: 'getCajaConfiguracion' })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<CajaConfiguracionEntity> {
    return this.cajaConfiguracionService.findOne(id);
  }

  @Mutation(() => CajaConfiguracionEntity)
  async createCajaConfiguracion(@Args('cajaConfiguracionInput') createCajaConfiguracionInput: CajaConfiguracionInput): Promise<CajaConfiguracionEntity> {
    return this.cajaConfiguracionService.create(createCajaConfiguracionInput);
  }

  @Mutation(() => CajaConfiguracionEntity)
  async updateCajaConfiguracion(@Args('cajaConfiguracionInput') updateCajaConfiguracionInput: CajaConfiguracionInput): Promise<CajaConfiguracionEntity> {
    return this.cajaConfiguracionService.update(updateCajaConfiguracionInput);
  }

  @Mutation(() => CajaConfiguracionEntity)
  async removeCajaConfiguracion(@Args('id', { type: () => Int }) id: number): Promise<number> {
    return this.cajaConfiguracionService.remove(id);
  }
}
