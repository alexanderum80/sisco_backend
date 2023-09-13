import { ConciliacionOperacionesDWHQueryResponse, ConciliaOperacionesDWHInput } from './../shared/models/query-operaciones-dwh.model';
import { ConciliaInternaDwhService } from './concilia-interna-dwh.service';
import { Resolver, Query, Args } from '@nestjs/graphql';

@Resolver()
export class ConciliaInternaDwhResolver {
  constructor(private _conciliaOperacionesDWHSvc: ConciliaInternaDwhService) {}

  @Query(() => ConciliacionOperacionesDWHQueryResponse)
  async conciliaInternaDWH(
    @Args({ name: 'conciliaInternaDWHInput', type: () => ConciliaOperacionesDWHInput }) conciliaInternaDWHInput: ConciliaOperacionesDWHInput,
  ): Promise<ConciliacionOperacionesDWHQueryResponse> {
    return this._conciliaOperacionesDWHSvc.conciliaInternaDWH(conciliaInternaDWHInput);
  }
}
