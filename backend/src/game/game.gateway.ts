import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class GameGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('paddles')
  handlePaddles(client: any, data: any) {
    client.broadcast.emit('paddles', data);
  }

  @SubscribeMessage('ball')
  handleBall(client: any, data: any) {
    client.broadcast.emit('ball', data);
  }

  @SubscribeMessage('score')
  handleScore(client: any, data: any) {
    client.broadcast.emit('score', data);
  }
}