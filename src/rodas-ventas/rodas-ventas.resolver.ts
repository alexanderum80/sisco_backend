import { RodasVentas } from './rodas-ventas.entity';
import { Resolver } from '@nestjs/graphql';

@Resolver(of => RodasVentas)
export class RodasVentasResolver {}
