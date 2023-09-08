import { SubscribeMessage, WebSocketGateway, Socket } from '@nestjs/websockets';
import { SendMessageDto } from './your-dto-folder';  // Import from the correct location

@WebSocketGateway()
export class ChatGateway {
  @SubscribeMessage('sendMessage')
  async sendMessage(client: Socket, payload: SendMessageDto) {
    // Broadcast message to chat room
  }
}
