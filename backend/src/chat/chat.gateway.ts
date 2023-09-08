import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

// src/chat/chat.gateway.ts
@WebSocketGateway()
export class ChatGateway {
  @SubscribeMessage('sendMessage')
  async sendMessage(client: Socket, payload: SendMessageDto) {
    // Broadcast message to chat room
  }
}
