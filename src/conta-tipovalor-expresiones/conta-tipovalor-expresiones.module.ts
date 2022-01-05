import { Module } from '@nestjs/common';
import { ContaTipovalorExpresionesService } from './conta-tipovalor-expresiones.service';
import { ContaTipovalorExpresionesResolver } from './conta-tipovalor-expresiones.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContaTipoValorExpresionesEntity } from './conta-tipovalor-expresiones.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContaTipoValorExpresionesEntity])],
  providers: [ContaTipovalorExpresionesService, ContaTipovalorExpresionesResolver]
})
export class ContaTipovalorExpresionesModule {}
