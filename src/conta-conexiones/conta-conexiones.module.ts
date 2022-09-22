import { SharedModule } from './../shared/shared.module';
import { UsuariosModule } from './../usuarios/usuarios.module';
import { UnidadesModule } from './../unidades/unidades.module';
import { ContaConexionesEntity } from './conta-conexiones.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ContaConexionesResolver } from './conta-conexiones.resolver';
import { ContaConexionesService } from './conta-conexiones.service';

@Module({
    imports: [TypeOrmModule.forFeature([ContaConexionesEntity]), UnidadesModule, UsuariosModule, SharedModule],
    providers: [ContaConexionesResolver, ContaConexionesService],
    exports: [ContaConexionesService],
})
export class ContaConexionesModule {}
