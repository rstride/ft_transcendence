import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto'

@Injectable()
export class UsersService {
  getAllUsers() {
    return [
      { id: 1, username: 'user1' },
      { id: 2, username: 'user2' },
    ];
  }

  async createUser(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    // Save user with hashedPassword
  }
}
