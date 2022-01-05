import { ContaEgastocuenta } from './elementos-gastos-cuenta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ElementosGastosCuentaResolver } from './elementos-gastos-cuenta.resolver';
import { ElementosGastosCuentaService } from './elementos-gastos-cuenta.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContaEgastocuenta])],
  providers: [ElementosGastosCuentaResolver, ElementosGastosCuentaService],
  exports: [ElementosGastosCuentaService]
})
export class ElementosGastosCuentaModule {}
