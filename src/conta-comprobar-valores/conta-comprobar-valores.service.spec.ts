import { Test, TestingModule } from '@nestjs/testing';
import { ContaComprobarValoresService } from './conta-comprobar-valores.service';

describe('ContaComprobarValoresService', () => {
  let service: ContaComprobarValoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContaComprobarValoresService],
    }).compile();

    service = module.get<ContaComprobarValoresService>(ContaComprobarValoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
