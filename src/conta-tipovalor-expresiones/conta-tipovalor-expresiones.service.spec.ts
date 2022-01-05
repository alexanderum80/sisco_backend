import { Test, TestingModule } from '@nestjs/testing';
import { ContaTipovalorExpresionesService } from './conta-tipovalor-expresiones.service';

describe('ContaTipovalorExpresionesService', () => {
  let service: ContaTipovalorExpresionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContaTipovalorExpresionesService],
    }).compile();

    service = module.get<ContaTipovalorExpresionesService>(ContaTipovalorExpresionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
