import { DWHInventario } from './dwh-inventario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DwhInventarioResolver } from './dwh-inventario.resolver';
import { DwhInventarioService } from './dwh-inventario.service';

@Module({
  imports: [TypeOrmModule.forFeature([DWHInventario])],
  providers: [DwhInventarioResolver, DwhInventarioService],
  exports: [DwhInventarioService]
})
export class DwhInventarioModule {}
