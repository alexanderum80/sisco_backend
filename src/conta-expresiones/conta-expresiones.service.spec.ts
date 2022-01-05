import { Test, TestingModule } from '@nestjs/testing';
import { ContaExpresionesService } from './conta-expresiones.service';

describe('ContaExpresionesService', () => {
  let service: ContaExpresionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContaExpresionesService],
    }).compile();

    service = module.get<ContaExpresionesService>(ContaExpresionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
