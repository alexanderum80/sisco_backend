import { ConciliaAftInput, ConciliaAftData } from './concilia-aft.model';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { ConciliaAftService } from './concilia-aft.service';

@Resolver()
export class ConciliaAftResolver {
    constructor(private readonly conciliaAftService: ConciliaAftService) {}

    @Query(() => ConciliaAftData)
    async conciliaAFT(@Args({ name: 'conciliaAftInput', type: () => ConciliaAftInput }) conciliaAftInput: ConciliaAftInput): Promise<ConciliaAftData> {
        return this.conciliaAftService.concilia(conciliaAftInput);
    }
}
