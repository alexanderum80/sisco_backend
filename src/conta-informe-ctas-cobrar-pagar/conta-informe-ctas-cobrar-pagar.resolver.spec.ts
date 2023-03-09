import { Test, TestingModule } from '@nestjs/testing';
import { ContaInformeCtasCobrarPagarResolver } from './conta-informe-ctas-cobrar-pagar.resolver';
import { ContaInformeCtasCobrarPagarService } from './conta-informe-ctas-cobrar-pagar.service';

describe('ContaInformeCtasCobrarPagarResolver', () => {
  let resolver: ContaInformeCtasCobrarPagarResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContaInformeCtasCobrarPagarResolver, ContaInformeCtasCobrarPagarService],
    }).compile();

    resolver = module.get<ContaInformeCtasCobrarPagarResolver>(ContaInformeCtasCobrarPagarResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
