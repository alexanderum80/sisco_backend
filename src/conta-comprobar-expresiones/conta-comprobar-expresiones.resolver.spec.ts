import { Test, TestingModule } from '@nestjs/testing';
import { ContaComprobarExpresionesResolver } from './conta-comprobar-expresiones.resolver';

describe('ContaComprobarExpresionesResolver', () => {
  let resolver: ContaComprobarExpresionesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContaComprobarExpresionesResolver],
    }).compile();

    resolver = module.get<ContaComprobarExpresionesResolver>(ContaComprobarExpresionesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
