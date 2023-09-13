import { Test, TestingModule } from '@nestjs/testing';
import { ContaEstadisticaResolver } from './conta-estadistica.resolver';
import { ContaEstadisticaService } from './conta-estadistica.service';

describe('ContaEstadisticaResolver', () => {
  let resolver: ContaEstadisticaResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContaEstadisticaResolver, ContaEstadisticaService],
    }).compile();

    resolver = module.get<ContaEstadisticaResolver>(ContaEstadisticaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
