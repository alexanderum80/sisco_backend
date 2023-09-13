import { Resolver, Query, Args } from '@nestjs/graphql';
import { ConciliaInternaContaService } from './concilia-interna-conta.service';
import { ConciliaInternaConta } from './entities/concilia-interna-conta.entity';
import { ConciliaInternaContaInput } from './dto/concilia-interna-conta.input';

@Resolver(() => ConciliaInternaConta)
export class ConciliaInternaContaResolver {
  constructor(private readonly conciliaInternaContaService: ConciliaInternaContaService) {}

  @Query(() => [ConciliaInternaConta], { name: 'conciliaInternaConta' })
  findAll(@Args('conciliaInternaContaInput', { type: () => ConciliaInternaContaInput }) conciliaInternaContaInput: ConciliaInternaContaInput) {
    return this.conciliaInternaContaService.findAll(conciliaInternaContaInput);
  }
}
