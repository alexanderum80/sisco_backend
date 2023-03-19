import { ConciliaDWH, ConciliaDWHInput } from './concilia-dwh.model';
import { ConciliaDwhService } from './concilia-dwh.service';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class ConciliaDwhResolver {
  constructor(private _conciliaDWHService: ConciliaDwhService) {}

  @Query(() => [ConciliaDWH])
  async conciliaDWH(@Args({ name: 'conciliaDWHInput', type: () => ConciliaDWHInput }) conciliaDWHInput: ConciliaDWHInput): Promise<ConciliaDWH[]> {
    return this._conciliaDWHService.conciliaDWH(conciliaDWHInput);
  }
}
