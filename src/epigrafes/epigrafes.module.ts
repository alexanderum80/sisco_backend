import { ContaEpigrafes } from './epigrafes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EpigrafesResolver } from './epigrafes.resolver';
import { EpigrafesService } from './epigrafes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContaEpigrafes])],
  providers: [EpigrafesResolver, EpigrafesService]
})
export class EpigrafesModule {}
