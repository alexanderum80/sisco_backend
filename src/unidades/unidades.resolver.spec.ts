import { Test, TestingModule } from '@nestjs/testing';
import { UnidadesResolver } from './unidades.resolver';

describe('UnidadesResolver', () => {
  let resolver: UnidadesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnidadesResolver],
    }).compile();

    resolver = module.get<UnidadesResolver>(UnidadesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
