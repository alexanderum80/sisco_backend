import { Almacenes } from './almacenes.entity';
import { Resolver } from '@nestjs/graphql';

@Resolver(of => Almacenes)
export class AlmacenesResolver {}
