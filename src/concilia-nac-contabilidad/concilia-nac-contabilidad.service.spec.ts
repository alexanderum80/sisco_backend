import { Test, TestingModule } from '@nestjs/testing';
import { ConciliaNacContabilidadService } from './concilia-nac-contabilidad.service';

describe('ConciliaNacContabilidadService', () => {
  let service: ConciliaNacContabilidadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConciliaNacContabilidadService],
    }).compile();

    service = module.get<ConciliaNacContabilidadService>(ConciliaNacContabilidadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
