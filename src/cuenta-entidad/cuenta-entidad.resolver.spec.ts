import { Test, TestingModule } from '@nestjs/testing';
import { CuentaEntidadResolver } from './cuenta-entidad.resolver';

describe('CuentaEntidadResolver', () => {
  let resolver: CuentaEntidadResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CuentaEntidadResolver],
    }).compile();

    resolver = module.get<CuentaEntidadResolver>(CuentaEntidadResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
