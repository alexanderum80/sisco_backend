import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TipoUsuariosService } from './tipo-usuarios.service';
import { TipoUsuariosResolver } from './tipo-usuarios.resolver';
import { TipoUsuarios } from './tipo-usuarios.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoUsuarios])],
  providers: [TipoUsuariosResolver, TipoUsuariosService],
})
export class TipoUsuariosModule {}
