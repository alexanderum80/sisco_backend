import { Module } from '@nestjs/common';
import { ContaEstadisticaService } from './conta-estadistica.service';
import { ContaEstadisticaResolver } from './conta-estadistica.resolver';

@Module({
  providers: [ContaEstadisticaResolver, ContaEstadisticaService]
})
export class ContaEstadisticaModule {}
