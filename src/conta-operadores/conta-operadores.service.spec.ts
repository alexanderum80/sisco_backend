import { Test, TestingModule } from '@nestjs/testing';
import { ContaOperadoresService } from './conta-operadores.service';

describe('ContaOperadoresService', () => {
  let service: ContaOperadoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContaOperadoresService],
    }).compile();

    service = module.get<ContaOperadoresService>(ContaOperadoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
