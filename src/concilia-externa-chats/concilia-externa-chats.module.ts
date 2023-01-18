import { ConciliaExternaChatsEntity } from './entities/concilia-externa-chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConciliaExternaChatsService } from './concilia-externa-chats.service';
import { ConciliaExternaChatsResolver } from './concilia-externa-chats.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ConciliaExternaChatsEntity])],
  providers: [ConciliaExternaChatsResolver, ConciliaExternaChatsService],
})
export class ConciliaExternaChatsModule {}
