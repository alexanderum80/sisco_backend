import { SharedModule } from './../shared/shared.module';
import { DWHConexiones } from './dwh-conexiones.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DwhConexionesResolver } from './dwh-conexiones.resolver';
import { DwhConexionesService } from './dwh-conexiones.service';

@Module({
  imports: [TypeOrmModule.forFeature([DWHConexiones]), SharedModule],
  providers: [DwhConexionesResolver, DwhConexionesService],
  exports: [DwhConexionesService],
})
export class DwhConexionesModule {}
