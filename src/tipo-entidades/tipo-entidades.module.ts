import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TipoEntidadesResolver } from './tipo-entidades.resolver';
import { TipoEntidadesService } from './tipo-entidades.service';
import { TipoEntidades } from './tipo-entidades.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoEntidades])],
  providers: [TipoEntidadesResolver, TipoEntidadesService],
})
export class TipoEntidadesModule {}
