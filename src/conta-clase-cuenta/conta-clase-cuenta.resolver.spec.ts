import { Test, TestingModule } from '@nestjs/testing';
import { ContaClaseCuentaResolver } from './conta-clase-cuenta.resolver';
import { ContaClaseCuentaService } from './conta-clase-cuenta.service';

describe('ContaClaseCuentaResolver', () => {
  let resolver: ContaClaseCuentaResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContaClaseCuentaResolver, ContaClaseCuentaService],
    }).compile();

    resolver = module.get<ContaClaseCuentaResolver>(ContaClaseCuentaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
