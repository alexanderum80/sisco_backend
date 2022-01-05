import { ConciliaInternaDwhService } from './concilia-interna-dwh.service';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { ConciliaInternaDWHInput, ConciliacionInternaDWHQueryResponse } from './concilia-interna-dwh.model';

@Resolver()
export class ConciliaInternaDwhResolver {
    constructor(
        private _conciliaInternaDWHSvc: ConciliaInternaDwhService
    ) {}

    @Query(() => ConciliacionInternaDWHQueryResponse)
    async conciliaInternaDWH(
        @Args({ name: 'conciliaInternaDWHInput', type: () => ConciliaInternaDWHInput }) conciliaInternaDWHInput: ConciliaInternaDWHInput
    ): Promise<ConciliacionInternaDWHQueryResponse> {
        return this._conciliaInternaDWHSvc.conciliaInternaDWH(conciliaInternaDWHInput);
    }
}
