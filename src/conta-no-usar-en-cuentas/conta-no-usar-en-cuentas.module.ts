import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContaNoUsarEnCuentaEntity } from './conta-no-usar-en-cuenta.entity';
import { ContaNoUsarEnCuentasResolver } from './conta-no-usar-en-cuentas.resolver';
import { ContaNoUsarEnCuentasService } from './conta-no-usar-en-cuentas.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContaNoUsarEnCuentaEntity])],
  providers: [ContaNoUsarEnCuentasResolver, ContaNoUsarEnCuentasService],
})
export class ContaNoUsarEnCuentasModule {}
