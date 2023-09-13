import { ClasificarEntidadesEntity } from './clasificador-entidades.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ClasificadorEntidadesResolver } from './clasificador-entidades.resolver';
import { ClasificadorEntidadesService } from './clasificador-entidades.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClasificarEntidadesEntity])],
  providers: [ClasificadorEntidadesResolver, ClasificadorEntidadesService],
})
export class ClasificadorEntidadesModule {}
