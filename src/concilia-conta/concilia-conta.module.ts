import { ClasificadorCuentaModule } from './../clasificador-cuenta/clasificador-cuenta.module';
import { SharedModule } from './../shared/shared.module';
import { UnidadesModule } from './../unidades/unidades.module';
import { RodasInventarioModule } from './../rodas-inventario/rodas-inventario.module';
import { Module } from '@nestjs/common';
import { ContaConexionesModule } from './../conta-conexiones/conta-conexiones.module';
import { ConciliaContaService } from './concilia-conta.service';
import { RodasVentasModule } from './../rodas-ventas/rodas-ventas.module';
import { ConciliaContaResolver } from './concilia-conta.resolver';

@Module({
  imports: [ContaConexionesModule, RodasInventarioModule, RodasVentasModule, UnidadesModule, SharedModule, ClasificadorCuentaModule],
  providers: [ConciliaContaService, ConciliaContaResolver],
  exports: [ConciliaContaService]
})
export class ConciliaContaModule {}
