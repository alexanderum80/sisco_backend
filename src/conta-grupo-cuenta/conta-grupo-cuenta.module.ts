import { GrupoCuentaEntity } from './entities/conta-grupo-cuenta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ContaGrupoCuentaService } from './conta-grupo-cuenta.service';
import { ContaGrupoCuentaResolver } from './conta-grupo-cuenta.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([GrupoCuentaEntity])],
  providers: [ContaGrupoCuentaResolver, ContaGrupoCuentaService],
})
export class ContaGrupoCuentaModule {}
