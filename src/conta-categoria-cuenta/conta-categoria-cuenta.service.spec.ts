import { Test, TestingModule } from '@nestjs/testing';
import { ContaCategoriaCuentaService } from './conta-categoria-cuenta.service';

describe('ContaCategoriaCuentaService', () => {
  let service: ContaCategoriaCuentaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContaCategoriaCuentaService],
    }).compile();

    service = module.get<ContaCategoriaCuentaService>(ContaCategoriaCuentaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
