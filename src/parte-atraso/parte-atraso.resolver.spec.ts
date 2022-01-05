import { Test, TestingModule } from '@nestjs/testing';
import { ParteAtrasoResolver } from './parte-atraso.resolver';

describe('ParteAtrasoResolver', () => {
  let resolver: ParteAtrasoResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParteAtrasoResolver],
    }).compile();

    resolver = module.get<ParteAtrasoResolver>(ParteAtrasoResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
