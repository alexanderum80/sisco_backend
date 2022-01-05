import { Almacenes } from './almacenes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AlmacenesResolver } from './almacenes.resolver';
import { AlmacenesService } from './almacenes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Almacenes])],
  providers: [AlmacenesResolver, AlmacenesService],
  exports: [AlmacenesService]
})
export class AlmacenesModule {}
