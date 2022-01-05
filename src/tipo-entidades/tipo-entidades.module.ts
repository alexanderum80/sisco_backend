import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TipoEntidadesResolver } from './tipo-entidades.resolver';
import { TipoEntidadesService } from './tipo-entidades.service';
import { ContaTipoentidades } from './tipo-entidades.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContaTipoentidades])],
  providers: [TipoEntidadesResolver, TipoEntidadesService]
})
export class TipoEntidadesModule {}
