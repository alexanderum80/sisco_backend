import { Test, TestingModule } from '@nestjs/testing';
import { ContaClaseCuentaService } from './conta-clase-cuenta.service';

describe('ContaClaseCuentaService', () => {
  let service: ContaClaseCuentaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContaClaseCuentaService],
    }).compile();

    service = module.get<ContaClaseCuentaService>(ContaClaseCuentaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
