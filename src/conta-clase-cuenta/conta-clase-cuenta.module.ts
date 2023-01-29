import { ClaseCuentaEntity } from './entities/conta-clase-cuenta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ContaClaseCuentaService } from './conta-clase-cuenta.service';
import { ContaClaseCuentaResolver } from './conta-clase-cuenta.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ClaseCuentaEntity])],
  providers: [ContaClaseCuentaResolver, ContaClaseCuentaService],
})
export class ContaClaseCuentaModule {}
