import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsuariosResolver } from './usuarios.resolver';
import { UsuariosService } from './usuarios.service';
import { UsuariosEntity } from './usuarios.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuariosEntity])],
  providers: [UsuariosResolver, UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
