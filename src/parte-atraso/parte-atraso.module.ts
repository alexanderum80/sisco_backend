import { UnidadesModule } from './../unidades/unidades.module';
import { DwhConexionesModule } from './../dwh-conexiones/dwh-conexiones.module';
import { DivisionesModule } from './../divisiones/divisiones.module';
import { Module } from '@nestjs/common';
import { ParteAtrasoResolver } from './parte-atraso.resolver';
import { ParteAtrasoService } from './parte-atraso.service';

@Module({
  imports: [DivisionesModule, DwhConexionesModule, UnidadesModule],
  providers: [ParteAtrasoResolver, ParteAtrasoService]
})
export class ParteAtrasoModule {}
