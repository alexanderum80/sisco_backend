import { Module } from '@nestjs/common';
import { ConexionesResolver } from './conexiones.resolver';
import { ConexionesService } from './conexiones.service';

@Module({
  providers: [ConexionesResolver, ConexionesService]
})
export class ConexionesModule {}
