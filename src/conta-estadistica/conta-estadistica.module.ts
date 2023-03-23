import { ContaEstadisticaEntity } from './entities/conta-estadistica.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContaConexionesModule } from './../conta-conexiones/conta-conexiones.module';
import { Module } from '@nestjs/common';
import { ContaEstadisticaService } from './conta-estadistica.service';
import { ContaEstadisticaResolver } from './conta-estadistica.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ContaEstadisticaEntity]), ContaConexionesModule],
  providers: [ContaEstadisticaResolver, ContaEstadisticaService],
  exports: [ContaEstadisticaService],
})
export class ContaEstadisticaModule {}
