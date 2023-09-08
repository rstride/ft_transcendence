import { Socket } from 'socket.io';
import { SendMessageDto } from './dto/send-message.dto';  // Import from the correct location
import { WebSocketGateway } from '@nestjs/websockets';
import { SubscribeMessage } from '@nestjs/websockets';



@WebSocketGateway()
export class ChatGateway {
  @SubscribeMessage('sendMessage')
  async sendMessage(client: Socket, payload: SendMessageDto) {
    // Broadcast message to chat room
  }
}
