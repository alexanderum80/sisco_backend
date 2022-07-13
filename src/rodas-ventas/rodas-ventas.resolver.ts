import { RodasVentas } from './rodas-ventas.entity';
import { Resolver } from '@nestjs/graphql';

@Resolver(() => RodasVentas)
export class RodasVentasResolver {}
