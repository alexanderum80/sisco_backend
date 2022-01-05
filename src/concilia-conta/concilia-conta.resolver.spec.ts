import { Test, TestingModule } from '@nestjs/testing';
import { ConciliaContaResolver } from './concilia-conta.resolver';

describe('ConciliaContaResolver', () => {
  let resolver: ConciliaContaResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConciliaContaResolver],
    }).compile();

    resolver = module.get<ConciliaContaResolver>(ConciliaContaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
