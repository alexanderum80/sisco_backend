import { Test, TestingModule } from '@nestjs/testing';
import { ContaNoUsarEnCuentasService } from './conta-no-usar-en-cuentas.service';

describe('ContaNoUsarEnCuentasService', () => {
  let service: ContaNoUsarEnCuentasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContaNoUsarEnCuentasService],
    }).compile();

    service = module.get<ContaNoUsarEnCuentasService>(ContaNoUsarEnCuentasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
