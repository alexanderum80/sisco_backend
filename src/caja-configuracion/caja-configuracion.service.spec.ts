import { Test, TestingModule } from '@nestjs/testing';
import { CajaConfiguracionService } from './caja-configuracion.service';

describe('CajaConfiguracionService', () => {
  let service: CajaConfiguracionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CajaConfiguracionService],
    }).compile();

    service = module.get<CajaConfiguracionService>(CajaConfiguracionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
