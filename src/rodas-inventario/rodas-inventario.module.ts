import { RodasInventario } from './rodas-inventario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RodasInventarioResolver } from './rodas-inventario.resolver';
import { RodasInventarioService } from './rodas-inventario.service';

@Module({
  imports: [TypeOrmModule.forFeature([RodasInventario])],
  providers: [RodasInventarioResolver, RodasInventarioService],
  exports: [RodasInventarioService]
})
export class RodasInventarioModule {}
