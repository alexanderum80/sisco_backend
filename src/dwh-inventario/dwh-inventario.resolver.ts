import { DWHInventario } from './dwh-inventario.entity';
import { Resolver } from '@nestjs/graphql';

@Resolver(() => DWHInventario)
export class DwhInventarioResolver {}
