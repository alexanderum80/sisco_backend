import { ConcnacContabilidad } from './concilia-nac-contabilidad.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConciliaNacContabilidadResolver } from './concilia-nac-contabilidad.resolver';
import { ConciliaNacContabilidadService } from './concilia-nac-contabilidad.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConcnacContabilidad])],
  providers: [ConciliaNacContabilidadResolver, ConciliaNacContabilidadService]
})
export class ConciliaNacContabilidadModule {}
