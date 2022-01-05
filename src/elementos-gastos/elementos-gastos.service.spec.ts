import { Test, TestingModule } from '@nestjs/testing';
import { ElementosGastosService } from './elementos-gastos.service';

describe('ElementosGastosService', () => {
  let service: ElementosGastosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElementosGastosService],
    }).compile();

    service = module.get<ElementosGastosService>(ElementosGastosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
