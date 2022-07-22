import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CajaConfiguracionService } from './caja-configuracion.service';
import { CajaConfiguracionResolver } from './caja-configuracion.resolver';
import { CajaConfiguracionEntity } from './caja-configuracion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CajaConfiguracionEntity])],
  providers: [CajaConfiguracionResolver, CajaConfiguracionService]
})
export class CajaConfiguracionModule {}
