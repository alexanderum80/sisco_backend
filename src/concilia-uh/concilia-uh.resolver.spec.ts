import { Test, TestingModule } from '@nestjs/testing';
import { ConciliaUhResolver } from './concilia-uh.resolver';
import { ConciliaUhService } from './concilia-uh.service';

describe('ConciliaUhResolver', () => {
  let resolver: ConciliaUhResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConciliaUhResolver, ConciliaUhService],
    }).compile();

    resolver = module.get<ConciliaUhResolver>(ConciliaUhResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
