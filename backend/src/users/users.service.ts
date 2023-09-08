import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CreateUserDto, SendMessageDto, CreateRoomDto, JoinRoomDto } from './your-dto-folder';


@Injectable()
export class UsersService {
  getAllUsers() {
    // Your logic to fetch all users goes here.
    // For now, let's return a sample array.
    return [
      { id: 1, username: 'user1' },
      { id: 2, username: 'user2' },
    ];
  }
}

// src/users/users.service.ts
import * as bcrypt from 'bcrypt';

async createUser(createUserDto: CreateUserDto) {
  const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
  // Save user with hashedPassword
}
