import { ConciliaExternaDatosConciliacionEntity } from './entities/concilia-externa-datos-conciliacion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConciliaExternaDatosConciliacionService } from './concilia-externa-datos-conciliacion.service';
import { ConciliaExternaDatosConciliacionResolver } from './concilia-externa-datos-conciliacion.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ConciliaExternaDatosConciliacionEntity])],
  providers: [ConciliaExternaDatosConciliacionResolver, ConciliaExternaDatosConciliacionService],
})
export class ConciliaExternaDatosConciliacionModule {}
