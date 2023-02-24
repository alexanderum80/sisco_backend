import { ActFijosClasificadorSubgrupoEntity } from './entities/actfijos-clasificador-subgrupo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ActfijosClasificadorSubgruposService } from './actfijos-clasificador-subgrupos.service';
import { ActfijosClasificadorSubgruposResolver } from './actfijos-clasificador-subgrupos.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ActFijosClasificadorSubgrupoEntity])],
  providers: [ActfijosClasificadorSubgruposResolver, ActfijosClasificadorSubgruposService],
})
export class ActfijosClasificadorSubgruposModule {}
