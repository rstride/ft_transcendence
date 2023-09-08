import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';  // Replace with your actual path


@Controller('chat')
export class ChatController {
  @Post('create-room')
  createRoom(@Body() createRoomDto: CreateRoomDto) {
   // your code
  }
}
