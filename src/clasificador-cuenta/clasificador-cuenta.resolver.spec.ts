import { Test, TestingModule } from '@nestjs/testing';
import { ClasificadorCuentaResolver } from './clasificador-cuenta.resolver';

describe('ClasificadorCuentaResolver', () => {
  let resolver: ClasificadorCuentaResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClasificadorCuentaResolver],
    }).compile();

    resolver = module.get<ClasificadorCuentaResolver>(ClasificadorCuentaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
