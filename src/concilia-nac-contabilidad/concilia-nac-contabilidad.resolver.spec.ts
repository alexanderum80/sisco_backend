import { Test, TestingModule } from '@nestjs/testing';
import { ConciliaNacContabilidadResolver } from './concilia-nac-contabilidad.resolver';

describe('ConciliaNacContabilidadResolver', () => {
  let resolver: ConciliaNacContabilidadResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConciliaNacContabilidadResolver],
    }).compile();

    resolver = module.get<ConciliaNacContabilidadResolver>(ConciliaNacContabilidadResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
