import { DwhVentasService } from './dwh-ventas.service';
import { DWHVentas } from './dwh-ventas.entity';
import { Resolver } from '@nestjs/graphql';

@Resolver(of => DWHVentas)
export class DwhVentasResolver {}
