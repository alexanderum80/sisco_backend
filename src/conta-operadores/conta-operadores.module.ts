import { ContaOperadoresEntity } from './conta-operadores.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContaOperadoresResolver } from './conta-operadores.resolver';
import { ContaOperadoresService } from './conta-operadores.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContaOperadoresEntity])],
  providers: [ContaOperadoresResolver, ContaOperadoresService]
})
export class ContaOperadoresModule {}
