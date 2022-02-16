import { Module } from '@nestjs/common';
import { DwhConexionesModule } from './../dwh-conexiones/dwh-conexiones.module';
import { ConciliaInternaDwhResolver } from './concilia-interna-dwh.resolver';
import { ConciliaInternaDwhService } from './concilia-interna-dwh.service';

@Module({
  imports: [DwhConexionesModule],
  providers: [ConciliaInternaDwhResolver, ConciliaInternaDwhService]
})
export class ConciliaInternaDwhModule {}
