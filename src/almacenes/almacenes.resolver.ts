import { Almacenes } from './almacenes.entity';
import { Resolver } from '@nestjs/graphql';

@Resolver(() => Almacenes)
export class AlmacenesResolver {}
