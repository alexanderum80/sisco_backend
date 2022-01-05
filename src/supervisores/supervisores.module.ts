import { UsuariosModule } from './../usuarios/usuarios.module';
import { Supervisor } from './supervisores.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SupervisoresResolver } from './supervisores.resolver';
import { SupervisoresService } from './supervisores.service';

@Module({
  imports: [TypeOrmModule.forFeature([Supervisor]), UsuariosModule],
  providers: [SupervisoresResolver, SupervisoresService]
})
export class SupervisoresModule {}
