import { CryptoService } from '../shared/services/crypto/crypto.service';
import { DWHConexiones } from './dwh-conexiones.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DwhConexionesResolver } from './dwh-conexiones.resolver';
import { DwhConexionesService } from './dwh-conexiones.service';

@Module({
  imports: [TypeOrmModule.forFeature([DWHConexiones])],
  providers: [DwhConexionesResolver, DwhConexionesService, CryptoService],
  exports: [DwhConexionesService]
})
export class DwhConexionesModule {}
