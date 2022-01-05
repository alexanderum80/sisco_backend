import { DWHInventario } from './dwh-inventario.entity';
import { Resolver } from '@nestjs/graphql';

@Resolver(of => DWHInventario)
export class DwhInventarioResolver {}
