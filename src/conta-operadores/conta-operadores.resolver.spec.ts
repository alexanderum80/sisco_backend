import { Test, TestingModule } from '@nestjs/testing';
import { ContaOperadoresResolver } from './conta-operadores.resolver';

describe('ContaOperadoresResolver', () => {
  let resolver: ContaOperadoresResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContaOperadoresResolver],
    }).compile();

    resolver = module.get<ContaOperadoresResolver>(ContaOperadoresResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
