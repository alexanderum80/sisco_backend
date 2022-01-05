import { Subdivisiones } from './subdivisiones.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SubdivisionesResolver } from './subdivisiones.resolver';
import { SubdivisionesService } from './subdivisiones.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subdivisiones])],
  providers: [SubdivisionesResolver, SubdivisionesService]
})
export class SubdivisionesModule {}
