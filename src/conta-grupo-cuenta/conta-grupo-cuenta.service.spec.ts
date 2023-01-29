import { Test, TestingModule } from '@nestjs/testing';
import { ContaGrupoCuentaService } from './conta-grupo-cuenta.service';

describe('ContaGrupoCuentaService', () => {
  let service: ContaGrupoCuentaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContaGrupoCuentaService],
    }).compile();

    service = module.get<ContaGrupoCuentaService>(ContaGrupoCuentaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
