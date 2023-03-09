import { Test, TestingModule } from '@nestjs/testing';
import { ContaInformeCtasCobrarPagarService } from './conta-informe-ctas-cobrar-pagar.service';

describe('ContaInformeCtasCobrarPagarService', () => {
  let service: ContaInformeCtasCobrarPagarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContaInformeCtasCobrarPagarService],
    }).compile();

    service = module.get<ContaInformeCtasCobrarPagarService>(ContaInformeCtasCobrarPagarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
