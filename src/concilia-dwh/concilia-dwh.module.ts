import { DivisionesModule } from './../divisiones/divisiones.module';
import { SharedModule } from './../shared/shared.module';
import { ContaConexionesModule } from './../conta-conexiones/conta-conexiones.module';
import { UnidadesModule } from './../unidades/unidades.module';
import { Module } from '@nestjs/common';
import { ConciliaDwhService } from './concilia-dwh.service';
import { ConciliaDwhResolver } from './concilia-dwh.resolver';
import { DwhConexionesModule } from './../dwh-conexiones/dwh-conexiones.module';
import { ConciliaContaModule } from './../concilia-conta/concilia-conta.module';

@Module({
    imports: [SharedModule, ContaConexionesModule, DwhConexionesModule, UnidadesModule, ConciliaContaModule, DivisionesModule],
    providers: [ConciliaDwhService, ConciliaDwhResolver],
})
export class ConciliaDwhModule {}
