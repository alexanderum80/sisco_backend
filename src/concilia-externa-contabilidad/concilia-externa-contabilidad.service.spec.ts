import { Test, TestingModule } from '@nestjs/testing';
import { ConciliaExtContabilidadService } from './concilia-externa-contabilidad.service';

describe('ConciliaExtContabilidadService', () => {
  let service: ConciliaExtContabilidadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConciliaExtContabilidadService],
    }).compile();

    service = module.get<ConciliaExtContabilidadService>(ConciliaExtContabilidadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
