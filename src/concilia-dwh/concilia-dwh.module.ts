import { DivisionesModule } from './../divisiones/divisiones.module';
import { SharedModule } from './../shared/shared.module';
import { ContaConexionesModule } from './../conta-conexiones/conta-conexiones.module';
import { AlmacenesModule } from './../almacenes/almacenes.module';
import { UnidadesModule } from './../unidades/unidades.module';
import { RodasVentasModule } from './../rodas-ventas/rodas-ventas.module';
import { Module } from '@nestjs/common';
import { ConciliaDwhService } from './concilia-dwh.service';
import { ConciliaDwhResolver } from './concilia-dwh.resolver';
import { DwhInventarioModule } from 'src/dwh-inventario/dwh-inventario.module';
import { DwhVentasModule } from 'src/dwh-ventas/dwh-ventas.module';
import { RodasInventarioModule } from 'src/rodas-inventario/rodas-inventario.module';
import { DwhConexionesModule } from 'src/dwh-conexiones/dwh-conexiones.module';
import { ConciliaContaModule } from 'src/concilia-conta/concilia-conta.module';

@Module({
  imports: [
    SharedModule,
    DwhInventarioModule,
    DwhVentasModule,
    RodasInventarioModule,
    RodasVentasModule,
    ContaConexionesModule,
    DwhConexionesModule,
    UnidadesModule,
    AlmacenesModule,
    ConciliaContaModule,
    DivisionesModule
  ],
  providers: [ConciliaDwhService, ConciliaDwhResolver]
})
export class ConciliaDwhModule {}
