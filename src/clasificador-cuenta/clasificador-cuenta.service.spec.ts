import { Test, TestingModule } from '@nestjs/testing';
import { ClasificadorCuentaService } from './clasificador-cuenta.service';

describe('ClasificadorCuentaService', () => {
  let service: ClasificadorCuentaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClasificadorCuentaService],
    }).compile();

    service = module.get<ClasificadorCuentaService>(ClasificadorCuentaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
