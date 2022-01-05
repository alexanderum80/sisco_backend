import { DWHVentas } from './dwh-ventas.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DwhVentasResolver } from './dwh-ventas.resolver';
import { DwhVentasService } from './dwh-ventas.service';

@Module({
  imports: [TypeOrmModule.forFeature([DWHVentas])],
  providers: [DwhVentasResolver, DwhVentasService],
  exports: [DwhVentasService]
})
export class DwhVentasModule {}
