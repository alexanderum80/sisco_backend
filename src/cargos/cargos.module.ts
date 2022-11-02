import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CargosResolver } from './cargos.resolver';
import { CargosService } from './cargos.service';
import { Cargos } from './cargos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cargos])],
  providers: [CargosResolver, CargosService],
})
export class CargosModule {}
