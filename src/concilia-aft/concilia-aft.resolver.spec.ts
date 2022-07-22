import { Test, TestingModule } from '@nestjs/testing';
import { ConciliaAftResolver } from './concilia-aft.resolver';
import { ConciliaAftService } from './concilia-aft.service';

describe('ConciliaAftResolver', () => {
  let resolver: ConciliaAftResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConciliaAftResolver, ConciliaAftService],
    }).compile();

    resolver = module.get<ConciliaAftResolver>(ConciliaAftResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
