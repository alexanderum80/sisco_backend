import { DivisionesModule } from './../divisiones/divisiones.module';
import { SharedModule } from './../shared/shared.module';
import { ContaConexionesModule } from './../conta-conexiones/conta-conexiones.module';
import { AlmacenesModule } from './../almacenes/almacenes.module';
import { UnidadesModule } from './../unidades/unidades.module';
import { Module } from '@nestjs/common';
import { ConciliaDwhService } from './concilia-dwh.service';
import { ConciliaDwhResolver } from './concilia-dwh.resolver';
import { DwhInventarioModule } from './../dwh-inventario/dwh-inventario.module';
import { DwhVentasModule } from './../dwh-ventas/dwh-ventas.module';
import { DwhConexionesModule } from './../dwh-conexiones/dwh-conexiones.module';
import { ConciliaContaModule } from './../concilia-conta/concilia-conta.module';

@Module({
    imports: [
        SharedModule,
        DwhInventarioModule,
        DwhVentasModule,
        ContaConexionesModule,
        DwhConexionesModule,
        UnidadesModule,
        AlmacenesModule,
        ConciliaContaModule,
        DivisionesModule,
    ],
    providers: [ConciliaDwhService, ConciliaDwhResolver],
})
export class ConciliaDwhModule {}
