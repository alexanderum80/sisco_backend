import { Test, TestingModule } from '@nestjs/testing';
import { ElementosGastosResolver } from './elementos-gastos.resolver';

describe('ElementosGastosResolver', () => {
  let resolver: ElementosGastosResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElementosGastosResolver],
    }).compile();

    resolver = module.get<ElementosGastosResolver>(ElementosGastosResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
