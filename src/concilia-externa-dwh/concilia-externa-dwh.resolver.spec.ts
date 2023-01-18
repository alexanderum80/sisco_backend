import { Test, TestingModule } from '@nestjs/testing';
import { ConciliaExternaDwhResolver } from './concilia-externa-dwh.resolver';
import { ConciliaExternaDwhService } from './concilia-externa-dwh.service';

describe('ConciliaExternaDwhResolver', () => {
  let resolver: ConciliaExternaDwhResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConciliaExternaDwhResolver, ConciliaExternaDwhService],
    }).compile();

    resolver = module.get<ConciliaExternaDwhResolver>(ConciliaExternaDwhResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
