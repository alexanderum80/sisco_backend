import { ContaCuentaentidad } from './cuenta-entidad.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CuentaEntidadResolver } from './cuenta-entidad.resolver';
import { CuentaEntidadService } from './cuenta-entidad.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContaCuentaentidad])],
  providers: [CuentaEntidadResolver, CuentaEntidadService],
  exports: [CuentaEntidadService]
})
export class CuentaEntidadModule {}
