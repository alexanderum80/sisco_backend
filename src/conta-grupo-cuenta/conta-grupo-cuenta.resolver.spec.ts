import { Test, TestingModule } from '@nestjs/testing';
import { ContaGrupoCuentaResolver } from './conta-grupo-cuenta.resolver';
import { ContaGrupoCuentaService } from './conta-grupo-cuenta.service';

describe('ContaGrupoCuentaResolver', () => {
  let resolver: ContaGrupoCuentaResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContaGrupoCuentaResolver, ContaGrupoCuentaService],
    }).compile();

    resolver = module.get<ContaGrupoCuentaResolver>(ContaGrupoCuentaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
