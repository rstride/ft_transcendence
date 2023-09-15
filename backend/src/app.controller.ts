import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SendMessageDto } from './chat/dto/send-message.dto';
import { Controller, Get } from '@nestjs/common';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  handleMessage(client: Socket, data: SendMessageDto) {
    client.broadcast.emit('message', data);
  }
}

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}