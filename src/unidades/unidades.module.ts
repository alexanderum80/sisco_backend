import { UsuariosModule } from './../usuarios/usuarios.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UnidadesResolver } from './unidades.resolver';
import { UnidadesService } from './unidades.service';
import { Unidades } from './unidades.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Unidades]), UsuariosModule],
  providers: [UnidadesResolver, UnidadesService],
  exports: [UnidadesService]
})
export class UnidadesModule {}
