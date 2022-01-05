import { Test, TestingModule } from '@nestjs/testing';
import { ElementosGastosCuentaService } from './elementos-gastos-cuenta.service';

describe('ElementosGastosCuentaService', () => {
  let service: ElementosGastosCuentaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElementosGastosCuentaService],
    }).compile();

    service = module.get<ElementosGastosCuentaService>(ElementosGastosCuentaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
