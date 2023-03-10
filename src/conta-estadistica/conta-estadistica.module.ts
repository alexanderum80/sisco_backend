import { ContaConexionesModule } from './../conta-conexiones/conta-conexiones.module';
import { Module } from '@nestjs/common';
import { ContaEstadisticaService } from './conta-estadistica.service';
import { ContaEstadisticaResolver } from './conta-estadistica.resolver';

@Module({
  imports: [ContaConexionesModule],
  providers: [ContaEstadisticaResolver, ContaEstadisticaService],
})
export class ContaEstadisticaModule {}
