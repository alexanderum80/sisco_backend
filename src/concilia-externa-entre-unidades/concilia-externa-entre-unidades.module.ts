import { ConciliaExtContabilidadModule } from './../concilia-externa-contabilidad/concilia-externa-contabilidad.module';
import { ConciliaExternaEntreUnidadesEntity } from './entities/concilia-externa-entre-unidades.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConciliaExternaEntreUnidadesService } from './concilia-externa-entre-unidades.service';
import { ConciliaExternaEntreUnidadesResolver } from './concilia-externa-entre-unidades.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ConciliaExternaEntreUnidadesEntity]), ConciliaExtContabilidadModule],
  providers: [ConciliaExternaEntreUnidadesResolver, ConciliaExternaEntreUnidadesService],
  exports: [ConciliaExternaEntreUnidadesService],
})
export class ConciliaExternaEntreUnidadesModule {}
