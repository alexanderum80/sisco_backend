import { RodasInventario } from './rodas-inventario.entity';
import { Resolver } from '@nestjs/graphql';

@Resolver(() => RodasInventario)
export class RodasInventarioResolver {}
