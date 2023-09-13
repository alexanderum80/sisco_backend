import { UsuariosModule } from './../usuarios/usuarios.module';
import { Empleado } from './empleados.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EmpleadosResolver } from './empleados.resolver';
import { EmpleadosService } from './empleados.service';

@Module({
  imports: [TypeOrmModule.forFeature([Empleado]), UsuariosModule],
  providers: [EmpleadosResolver, EmpleadosService],
})
export class EmpleadosModule {}
