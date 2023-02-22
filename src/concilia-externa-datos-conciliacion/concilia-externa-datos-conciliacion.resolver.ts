import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ConciliaExternaDatosConciliacionService } from './concilia-externa-datos-conciliacion.service';
import { ConciliaExternaDatosConciliacionEntity } from './entities/concilia-externa-datos-conciliacion.entity';

@Resolver(() => ConciliaExternaDatosConciliacionEntity)
export class ConciliaExternaDatosConciliacionResolver {
  constructor(private readonly conciliaExternaDatosConciliacionService: ConciliaExternaDatosConciliacionService) {}

  @Mutation(() => ConciliaExternaDatosConciliacionEntity, { name: 'inicializarConciliacion' })
  createConciliaExternaDatosConciliacion(@Args('anno', { type: () => Int }) anno: number, @Args('mes', { type: () => Int }) mes: number) {
    return this.conciliaExternaDatosConciliacionService.create(anno, mes);
  }

  @Query(() => [ConciliaExternaDatosConciliacionEntity], { name: 'getAllDatosConciliacionExterna' })
  findAll() {
    return this.conciliaExternaDatosConciliacionService.findAll();
  }

  @Query(() => ConciliaExternaDatosConciliacionEntity, { name: 'getDatosConciliacionExterna', nullable: true })
  async findOneByAnnoMes(@Args('anno', { type: () => Int }) anno: number, @Args('mes', { type: () => Int }) mes: number): Promise<ConciliaExternaDatosConciliacionEntity> {
    return this.conciliaExternaDatosConciliacionService.findOneByAnnoMes(anno, mes);
  }

  @Mutation(() => Number, { name: 'cerrarConciliacion' })
  async closeConciliaExternaDatosConciliacion(@Args('anno', { type: () => Int }) anno: number, @Args('mes', { type: () => Int }) mes: number): Promise<number> {
    return this.conciliaExternaDatosConciliacionService.updateEstado(anno, mes, false);
  }

  @Mutation(() => Number, { name: 'reabrirConciliacion' })
  async reopenConciliaExternaDatosConciliacion(@Args('anno', { type: () => Int }) anno: number, @Args('mes', { type: () => Int }) mes: number): Promise<number> {
    return this.conciliaExternaDatosConciliacionService.updateEstado(anno, mes, true);
  }
}
