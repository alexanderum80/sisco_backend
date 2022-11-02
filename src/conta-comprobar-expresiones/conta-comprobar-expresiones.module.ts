import { Module } from '@nestjs/common';
import { ContaComprobarExpresionesService } from './conta-comprobar-expresiones.service';
import { ContaComprobarExpresionesResolver } from './conta-comprobar-expresiones.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContaComprobarExpresionesEntity } from './conta-comprobar-expresiones.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContaComprobarExpresionesEntity])],
  providers: [ContaComprobarExpresionesService, ContaComprobarExpresionesResolver],
})
export class ContaComprobarExpresionesModule {}
