import { Test, TestingModule } from '@nestjs/testing';
import { TipoEntidadesResolver } from './tipo-entidades.resolver';

describe('TipoEntidadesResolver', () => {
  let resolver: TipoEntidadesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoEntidadesResolver],
    }).compile();

    resolver = module.get<TipoEntidadesResolver>(TipoEntidadesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
