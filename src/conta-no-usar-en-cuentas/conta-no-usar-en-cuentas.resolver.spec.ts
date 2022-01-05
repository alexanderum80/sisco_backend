import { Test, TestingModule } from '@nestjs/testing';
import { ContaNoUsarEnCuentasResolver } from './conta-no-usar-en-cuentas.resolver';

describe('ContaNoUsarEnCuentasResolver', () => {
  let resolver: ContaNoUsarEnCuentasResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContaNoUsarEnCuentasResolver],
    }).compile();

    resolver = module.get<ContaNoUsarEnCuentasResolver>(ContaNoUsarEnCuentasResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
