import { Test, TestingModule } from '@nestjs/testing';
import { EpigrafesResolver } from './epigrafes.resolver';

describe('EpigrafesResolver', () => {
  let resolver: EpigrafesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EpigrafesResolver],
    }).compile();

    resolver = module.get<EpigrafesResolver>(EpigrafesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
