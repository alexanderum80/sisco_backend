import { Test, TestingModule } from '@nestjs/testing';
import { ElementosGastosCuentaResolver } from './elementos-gastos-cuenta.resolver';

describe('ElementosGastosCuentaResolver', () => {
  let resolver: ElementosGastosCuentaResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElementosGastosCuentaResolver],
    }).compile();

    resolver = module.get<ElementosGastosCuentaResolver>(ElementosGastosCuentaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
