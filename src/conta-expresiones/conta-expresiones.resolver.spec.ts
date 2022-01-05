import { Test, TestingModule } from '@nestjs/testing';
import { ContaExpresionesResumenResolver } from './conta-expresiones.resolver';

describe('ContaExpresionesResolver', () => {
  let resolver: ContaExpresionesResumenResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContaExpresionesResumenResolver],
    }).compile();

    resolver = module.get<ContaExpresionesResumenResolver>(ContaExpresionesResumenResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
