import { ConciliaExternaInput } from './dto/concilia-externa.input';
import { Resolver, Args, Query } from '@nestjs/graphql';
import { ConciliaExternaService } from './concilia-externa.service';
import { ConciliaExternaEntity } from './entities/concilia-externa.entity';

@Resolver()
export class ConciliaExternaResolver {
  constructor(private readonly conciliaExternaService: ConciliaExternaService) {}

  @Query(() => ConciliaExternaEntity)
  async getConciliacion(@Args({ name: 'conciliaExternaInput', type: () => ConciliaExternaInput }) conciliaExternaInput: ConciliaExternaInput): Promise<ConciliaExternaEntity> {
    return this.conciliaExternaService.getConciliacion(conciliaExternaInput);
  }
}
