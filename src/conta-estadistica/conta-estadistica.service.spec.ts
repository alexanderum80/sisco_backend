import { Test, TestingModule } from '@nestjs/testing';
import { ContaEstadisticaService } from './conta-estadistica.service';

describe('ContaEstadisticaService', () => {
  let service: ContaEstadisticaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContaEstadisticaService],
    }).compile();

    service = module.get<ContaEstadisticaService>(ContaEstadisticaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
