import { Test, TestingModule } from '@nestjs/testing';
import { ContaComprobarValoresResolver } from './conta-comprobar-valores.resolver';
import { ContaComprobarValoresService } from './conta-comprobar-valores.service';

describe('ContaComprobarValoresResolver', () => {
  let resolver: ContaComprobarValoresResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContaComprobarValoresResolver, ContaComprobarValoresService],
    }).compile();

    resolver = module.get<ContaComprobarValoresResolver>(ContaComprobarValoresResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
