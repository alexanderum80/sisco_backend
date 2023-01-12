import { ConciliaExternaEntreUnidadesModule } from './../concilia-externa-entre-unidades/concilia-externa-entre-unidades.module';
import { ConciliaExternaDwhModule } from './../concilia-externa-dwh/concilia-externa-dwh.module';
import { ConciliaExtContabilidadModule } from './../concilia-externa-contabilidad/concilia-externa-contabilidad.module';
import { Module } from '@nestjs/common';
import { ConciliaExternaService } from './concilia-externa.service';
import { ConciliaExternaResolver } from './concilia-externa.resolver';

@Module({
  imports: [ConciliaExtContabilidadModule, ConciliaExternaDwhModule, ConciliaExternaEntreUnidadesModule],
  providers: [ConciliaExternaResolver, ConciliaExternaService],
})
export class ConciliaExternaModule {}
