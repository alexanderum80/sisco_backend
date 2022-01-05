import { Test, TestingModule } from '@nestjs/testing';
import { ContaConexionesResolver } from './conta-conexiones.resolver';

describe('ContaConexionesResolver', () => {
  let resolver: ContaConexionesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContaConexionesResolver],
    }).compile();

    resolver = module.get<ContaConexionesResolver>(ContaConexionesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
