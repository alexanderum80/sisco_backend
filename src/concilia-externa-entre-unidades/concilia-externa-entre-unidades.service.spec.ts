import { Test, TestingModule } from '@nestjs/testing';
import { ConciliaExternaEntreUnidadesService } from './concilia-externa-entre-unidades.service';

describe('ConciliaExternaEntreUnidadesService', () => {
  let service: ConciliaExternaEntreUnidadesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConciliaExternaEntreUnidadesService],
    }).compile();

    service = module.get<ConciliaExternaEntreUnidadesService>(ConciliaExternaEntreUnidadesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
