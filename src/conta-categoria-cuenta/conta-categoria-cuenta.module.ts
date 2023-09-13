import { CategoriaCuentaEntity } from './entities/conta-categoria-cuenta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ContaCategoriaCuentaService } from './conta-categoria-cuenta.service';
import { ContaCategoriaCuentaResolver } from './conta-categoria-cuenta.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaCuentaEntity])],
  providers: [ContaCategoriaCuentaResolver, ContaCategoriaCuentaService],
})
export class ContaCategoriaCuentaModule {}
