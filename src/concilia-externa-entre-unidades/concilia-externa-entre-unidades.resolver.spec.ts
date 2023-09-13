import { Test, TestingModule } from '@nestjs/testing';
import { ConciliaExternaEntreUnidadesResolver } from './concilia-externa-entre-unidades.resolver';
import { ConciliaExternaEntreUnidadesService } from './concilia-externa-entre-unidades.service';

describe('ConciliaExternaEntreUnidadesResolver', () => {
  let resolver: ConciliaExternaEntreUnidadesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConciliaExternaEntreUnidadesResolver, ConciliaExternaEntreUnidadesService],
    }).compile();

    resolver = module.get<ConciliaExternaEntreUnidadesResolver>(ConciliaExternaEntreUnidadesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
