import { DWHVentas } from './dwh-ventas.entity';
import { Resolver } from '@nestjs/graphql';

@Resolver(() => DWHVentas)
export class DwhVentasResolver {}
