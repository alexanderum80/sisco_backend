import { ClasificadorCuentaRealEntity } from './clasificador-cuenta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ClasificadorCuentaResolver } from './clasificador-cuenta.resolver';
import { ClasificadorCuentaService } from './clasificador-cuenta.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClasificadorCuentaRealEntity])],
  providers: [ClasificadorCuentaResolver, ClasificadorCuentaService],
  exports: [ClasificadorCuentaService],
})
export class ClasificadorCuentaModule {}
