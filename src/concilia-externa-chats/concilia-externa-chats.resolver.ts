import { ConciliaExternaChatsEntity } from './entities/concilia-externa-chat.entity';
import { Resolver } from '@nestjs/graphql';

@Resolver(() => ConciliaExternaChatsEntity)
export class ConciliaExternaChatsResolver {}
