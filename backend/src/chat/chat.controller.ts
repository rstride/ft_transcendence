import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';

@Controller('chat')
export class ChatController {
  @Post('create-room')
  createRoom(@Body() createRoomDto: CreateRoomDto) {
   // your code
  }
}
