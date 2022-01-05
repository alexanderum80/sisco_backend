import { RodasInventario } from './rodas-inventario.entity';
import { Resolver } from '@nestjs/graphql';

@Resolver(of => RodasInventario)
export class RodasInventarioResolver {}
