import { ConcExtContabilidad } from './entities/concilia-externa-contabilidad.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConciliaExtContabilidadResolver } from './concilia-externa-contabilidad.resolver';
import { ConciliaExtContabilidadService } from './concilia-externa-contabilidad.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConcExtContabilidad])],
  providers: [ConciliaExtContabilidadResolver, ConciliaExtContabilidadService],
  exports: [ConciliaExtContabilidadService],
})
export class ConciliaExtContabilidadModule {}
