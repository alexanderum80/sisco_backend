import { Module } from '@nestjs/common';
import { ContaInformeCtasCobrarPagarService } from './conta-informe-ctas-cobrar-pagar.service';
import { ContaInformeCtasCobrarPagarResolver } from './conta-informe-ctas-cobrar-pagar.resolver';

@Module({
  providers: [ContaInformeCtasCobrarPagarResolver, ContaInformeCtasCobrarPagarService],
})
export class ContaInformeCtasCobrarPagarModule {}
