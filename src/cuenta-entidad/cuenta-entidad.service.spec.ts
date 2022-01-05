import { Test, TestingModule } from '@nestjs/testing';
import { CuentaEntidadService } from './cuenta-entidad.service';

describe('CuentaEntidadService', () => {
  let service: CuentaEntidadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CuentaEntidadService],
    }).compile();

    service = module.get<CuentaEntidadService>(CuentaEntidadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
