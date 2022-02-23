import { ContaElementosGastos } from './elementos-gastos.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ElementosGastosResolver } from './elementos-gastos.resolver';
import { ElementosGastosService } from './elementos-gastos.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContaElementosGastos])],
  providers: [ElementosGastosResolver, ElementosGastosService]
})
export class ElementosGastosModule {}
