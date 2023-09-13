import { ConciliaExternaChatsService } from './concilia-externa-chats/concilia-externa-chats.service';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as socket from 'socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(function (_req: any, res: any, next: any) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });

  const server = await app.listen('3000');

  // Socket
  const io = new socket.Server(server, {
    cors: {
      origin: ['http://localhost:4200', 'http://sisco.trd.gae.com.cu'],
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', socket => {
    let IdUsuario: string;

    io.emit('new-connection', null);

    socket.on('connect-user', idUsuario => {
      IdUsuario = idUsuario;
      io.emit('connected-user', IdUsuario);
    });

    socket.on('new-message', message => {
      ConciliaExternaChatsService.registerChat(message);
      io.emit('new-message', message);
    });

    socket.on('disconnect-user', () => {
      if (IdUsuario) {
        io.emit('disconnected-user', IdUsuario);
      }
    });

    socket.on('disconnect', () => {
      if (IdUsuario) {
        io.emit('disconnected-user', IdUsuario);
      }
    });

    socket.on('concilia-status-change', status => {
      io.emit('concilia-status', status);
    });
  });
}

bootstrap();
