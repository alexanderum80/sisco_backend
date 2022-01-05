import { Test, TestingModule } from '@nestjs/testing';
import { ContaComprobarExpresionesService } from './conta-comprobar-expresiones.service';

describe('ContaComprobarExpresionesService', () => {
  let service: ContaComprobarExpresionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContaComprobarExpresionesService],
    }).compile();

    service = module.get<ContaComprobarExpresionesService>(ContaComprobarExpresionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
