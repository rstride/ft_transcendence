// src/chat/dto/create-room.dto.ts

import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
