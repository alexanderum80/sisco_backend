import { Test, TestingModule } from '@nestjs/testing';
import { ConciliaExtContabilidadResolver } from './concilia-externa-contabilidad.resolver';

describe('ConciliaExtContabilidadResolver', () => {
  let resolver: ConciliaExtContabilidadResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConciliaExtContabilidadResolver],
    }).compile();

    resolver = module.get<ConciliaExtContabilidadResolver>(ConciliaExtContabilidadResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
