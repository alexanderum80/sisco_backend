import { SharedModule } from './../shared/shared.module';
import { ContaConexionesModule } from './../conta-conexiones/conta-conexiones.module';
import { ConciliaContaModule } from './../concilia-conta/concilia-conta.module';
import { Module } from '@nestjs/common';
import { ConciliaAftService } from './concilia-aft.service';
import { ConciliaAftResolver } from './concilia-aft.resolver';

@Module({
    imports: [ConciliaContaModule, ContaConexionesModule, SharedModule],
    providers: [ConciliaAftResolver, ConciliaAftService],
})
export class ConciliaAftModule {}
