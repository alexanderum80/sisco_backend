import { ConciliaUH, ConciliaUhInput } from './concilia-uh.model';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { ConciliaUhService } from './concilia-uh.service';

@Resolver()
export class ConciliaUhResolver {
  constructor(private readonly conciliaUhService: ConciliaUhService) {}

  @Query(() => [ConciliaUH])
  async conciliaUH(@Args({ name: 'conciliaUhInput', type: () => ConciliaUhInput }) conciliaAftInput: ConciliaUhInput): Promise<ConciliaUH[]> {
    return this.conciliaUhService.concilia(conciliaAftInput);
  }
}
