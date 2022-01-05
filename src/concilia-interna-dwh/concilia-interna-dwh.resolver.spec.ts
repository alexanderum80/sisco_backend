import { Test, TestingModule } from '@nestjs/testing';
import { ConciliaInternaDwhResolver } from './concilia-interna-dwh.resolver';

describe('ConciliaInternaDwhResolver', () => {
  let resolver: ConciliaInternaDwhResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConciliaInternaDwhResolver],
    }).compile();

    resolver = module.get<ConciliaInternaDwhResolver>(ConciliaInternaDwhResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
