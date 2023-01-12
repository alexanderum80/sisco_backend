import { Test, TestingModule } from '@nestjs/testing';
import { ConciliaExternaResolver } from './concilia-externa.resolver';
import { ConciliaExternaService } from './concilia-externa.service';

describe('ConciliaExternaResolver', () => {
  let resolver: ConciliaExternaResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConciliaExternaResolver, ConciliaExternaService],
    }).compile();

    resolver = module.get<ConciliaExternaResolver>(ConciliaExternaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
