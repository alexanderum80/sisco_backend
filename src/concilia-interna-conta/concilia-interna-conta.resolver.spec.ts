import { Test, TestingModule } from '@nestjs/testing';
import { ConciliaInternaContaResolver } from './concilia-interna-conta.resolver';
import { ConciliaInternaContaService } from './concilia-interna-conta.service';

describe('ConciliaInternaContaResolver', () => {
  let resolver: ConciliaInternaContaResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConciliaInternaContaResolver, ConciliaInternaContaService],
    }).compile();

    resolver = module.get<ConciliaInternaContaResolver>(ConciliaInternaContaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
