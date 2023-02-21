import { ConciliaExternaChatInput } from './dto/concilia-externa-chat.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ConciliaExternaChatsEntity } from './entities/concilia-externa-chat.entity';

let chatRepository: Repository<ConciliaExternaChatsEntity>;

@Injectable()
export class ConciliaExternaChatsService {
  public that = this;

  constructor(@InjectRepository(ConciliaExternaChatsEntity) public readonly chatsRepository: Repository<ConciliaExternaChatsEntity>) {
    chatRepository = chatsRepository;
  }

  static async registerChat(messageInput: any): Promise<ConciliaExternaChatsEntity> {
    const newMessage: ConciliaExternaChatInput = {
      Usuario: messageInput.idUser,
      Mensaje: messageInput.text,
    };

    return new Promise<ConciliaExternaChatsEntity>((resolve, reject) => {
      chatRepository
        .save(newMessage)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err.message || err);
        });
    });
  }
}
