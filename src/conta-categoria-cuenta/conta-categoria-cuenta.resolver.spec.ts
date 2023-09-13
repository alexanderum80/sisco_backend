import { Test, TestingModule } from '@nestjs/testing';
import { ContaCategoriaCuentaResolver } from './conta-categoria-cuenta.resolver';
import { ContaCategoriaCuentaService } from './conta-categoria-cuenta.service';

describe('ContaCategoriaCuentaResolver', () => {
  let resolver: ContaCategoriaCuentaResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContaCategoriaCuentaResolver, ContaCategoriaCuentaService],
    }).compile();

    resolver = module.get<ContaCategoriaCuentaResolver>(ContaCategoriaCuentaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
