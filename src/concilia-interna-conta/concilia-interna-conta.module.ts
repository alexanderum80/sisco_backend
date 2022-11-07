import { Module } from '@nestjs/common';
import { ConciliaInternaContaService } from './concilia-interna-conta.service';
import { ConciliaInternaContaResolver } from './concilia-interna-conta.resolver';

@Module({
  providers: [ConciliaInternaContaResolver, ConciliaInternaContaService]
})
export class ConciliaInternaContaModule {}
