import { DwhConexionesModule } from './../dwh-conexiones/dwh-conexiones.module';
import { ConciliaExternaDWHEntity } from './entities/concilia-externa-dwh.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConciliaExternaDwhService } from './concilia-externa-dwh.service';
import { ConciliaExternaDwhResolver } from './concilia-externa-dwh.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ConciliaExternaDWHEntity]), DwhConexionesModule],
  providers: [ConciliaExternaDwhResolver, ConciliaExternaDwhService],
  exports: [ConciliaExternaDwhService],
})
export class ConciliaExternaDwhModule {}
