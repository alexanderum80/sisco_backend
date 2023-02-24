import { UsuariosModule } from './../usuarios/usuarios.module';
import { DivisionesEntity } from './divisiones.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DivisionesResolver } from './divisiones.resolver';
import { DivisionesService } from './divisiones.service';

@Module({
  imports: [TypeOrmModule.forFeature([DivisionesEntity]), UsuariosModule],
  providers: [DivisionesResolver, DivisionesService],
  exports: [DivisionesService],
})
export class DivisionesModule {}
