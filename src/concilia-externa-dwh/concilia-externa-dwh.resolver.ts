import { ConciliacionOperacionesDWHQueryResponse, ConciliaOperacionesDWHInput } from './../shared/models/query-operaciones-dwh.model';
import { ConciliaExternaDwhInput } from './dto/concilia-externa-dwh.input';
import { Resolver, Mutation, Args, Int, Query } from '@nestjs/graphql';
import { ConciliaExternaDwhService } from './concilia-externa-dwh.service';
import { ConciliaExternaDWHEntity } from './entities/concilia-externa-dwh.entity';

@Resolver(() => ConciliaExternaDWHEntity)
export class ConciliaExternaDwhResolver {
  constructor(private conciliaDWHSvc: ConciliaExternaDwhService) {}

  @Query(() => ConciliacionOperacionesDWHQueryResponse)
  async conciliaExternaDWH(
    @Args({ name: 'conciliaExternaDWHInput', type: () => ConciliaOperacionesDWHInput }) conciliaExternaDWHInput: ConciliaOperacionesDWHInput,
  ): Promise<ConciliacionOperacionesDWHQueryResponse> {
    return this.conciliaDWHSvc.conciliaExternaDWH(conciliaExternaDWHInput);
  }

  @Mutation(() => Int)
  async updateConciliaDWH(@Args({ name: 'conciliaDWH', type: () => [ConciliaExternaDwhInput] }) conciliaDWH: ConciliaExternaDwhInput[]): Promise<number> {
    return this.conciliaDWHSvc.updateConciliaDWH(conciliaDWH);
  }
}
