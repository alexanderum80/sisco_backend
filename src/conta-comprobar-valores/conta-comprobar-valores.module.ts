import { Module } from '@nestjs/common';
import { ContaComprobarValoresService } from './conta-comprobar-valores.service';
import { ContaComprobarValoresResolver } from './conta-comprobar-valores.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComprobarValoresEntity } from './conta-comprobar-valores.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ComprobarValoresEntity])],
  providers: [ContaComprobarValoresResolver, ContaComprobarValoresService]
})
export class ContaComprobarValoresModule {}
