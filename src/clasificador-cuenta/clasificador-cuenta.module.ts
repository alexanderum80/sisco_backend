import { ClasificadorCuentaReal } from './clasificador-cuenta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ClasificadorCuentaResolver } from './clasificador-cuenta.resolver';
import { ClasificadorCuentaService } from './clasificador-cuenta.service';
import { CuentaEntidadModule } from 'src/cuenta-entidad/cuenta-entidad.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClasificadorCuentaReal]), CuentaEntidadModule],
  providers: [ClasificadorCuentaResolver, ClasificadorCuentaService],
  exports: [ClasificadorCuentaService]
})
export class ClasificadorCuentaModule {}
