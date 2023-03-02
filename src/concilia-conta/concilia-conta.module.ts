import { LogsModule } from './../logs/logs.module';
import { ClasificadorCuentaModule } from './../clasificador-cuenta/clasificador-cuenta.module';
import { SharedModule } from './../shared/shared.module';
import { UnidadesModule } from './../unidades/unidades.module';
import { Module } from '@nestjs/common';
import { ContaConexionesModule } from './../conta-conexiones/conta-conexiones.module';
import { ConciliaContaService } from './concilia-conta.service';
import { ConciliaContaResolver } from './concilia-conta.resolver';

@Module({
  imports: [ContaConexionesModule, UnidadesModule, SharedModule, ClasificadorCuentaModule, LogsModule],
  providers: [ConciliaContaService, ConciliaContaResolver],
  exports: [ConciliaContaService],
})
export class ConciliaContaModule {}
