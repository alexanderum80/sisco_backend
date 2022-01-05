import { UsuariosModule } from './../usuarios/usuarios.module';
import { UnidadesModule } from './../unidades/unidades.module';
import { CryptoService } from '../shared/services/crypto/crypto.service';
import { ContaConexiones } from './conta-conexiones.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ContaConexionesResolver } from './conta-conexiones.resolver';
import { ContaConexionesService } from './conta-conexiones.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContaConexiones]), UnidadesModule, UsuariosModule],
  providers: [ContaConexionesResolver, ContaConexionesService, CryptoService],
  exports: [ContaConexionesService]
})
export class ContaConexionesModule {}
