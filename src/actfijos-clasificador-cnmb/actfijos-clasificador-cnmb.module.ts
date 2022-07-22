import { ActFijosClasificadorCnmbEntity } from './actfijos-clasificador-cnmb.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ActfijosClasificadorCnmbService } from './actfijos-clasificador-cnmb.service';
import { ActfijosClasificadorCnmbResolver } from './actfijos-clasificador-cnmb.resolver';

@Module({
    imports: [TypeOrmModule.forFeature([ActFijosClasificadorCnmbEntity])],
    providers: [ActfijosClasificadorCnmbResolver, ActfijosClasificadorCnmbService],
})
export class ActfijosClasificadorCnmbModule {}
