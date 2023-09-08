import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Socket } from 'socket.io';
import { CreateUserDto, SendMessageDto, CreateRoomDto, JoinRoomDto } from './your-dto-folder';  // Import from the correct location

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
