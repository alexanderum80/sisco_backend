import { SharedModule } from './../shared/shared.module';
import { ContaConexionesModule } from './../conta-conexiones/conta-conexiones.module';
import { ConciliaContaModule } from './../concilia-conta/concilia-conta.module';
import { Module } from '@nestjs/common';
import { ConciliaUhService } from './concilia-uh.service';
import { ConciliaUhResolver } from './concilia-uh.resolver';

@Module({
    imports: [ConciliaContaModule, ContaConexionesModule, SharedModule],
    providers: [ConciliaUhResolver, ConciliaUhService],
})
export class ConciliaUhModule {}
