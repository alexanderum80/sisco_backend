import { RodasVentas } from './rodas-ventas.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RodasVentasResolver } from './rodas-ventas.resolver';
import { RodasVentasService } from './rodas-ventas.service';

@Module({
  imports: [TypeOrmModule.forFeature([RodasVentas])],
  providers: [RodasVentasResolver, RodasVentasService],
  exports: [RodasVentasService]
})
export class RodasVentasModule {}
