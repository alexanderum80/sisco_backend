import { ExpresionesResumenEntity, ExpresionesDetalleEntity } from './conta-expresiones.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ContaExpresionesResumenResolver, ContaExpresionesDetalleResolver } from './conta-expresiones.resolver';
import { ContaExpresionesService } from './conta-expresiones.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExpresionesResumenEntity, ExpresionesDetalleEntity])],
  providers: [ContaExpresionesResumenResolver, ContaExpresionesDetalleResolver, ContaExpresionesService]
})
export class ContaExpresionesModule {}
