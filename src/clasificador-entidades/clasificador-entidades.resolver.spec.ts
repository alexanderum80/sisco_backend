import { Test, TestingModule } from '@nestjs/testing';
import { ClasificadorEntidadesResolver } from './clasificador-entidades.resolver';

describe('ClasificadorEntidadesResolver', () => {
  let resolver: ClasificadorEntidadesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClasificadorEntidadesResolver],
    }).compile();

    resolver = module.get<ClasificadorEntidadesResolver>(ClasificadorEntidadesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
