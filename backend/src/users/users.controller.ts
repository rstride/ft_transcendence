import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CreateUserDto, SendMessageDto } from './dto';



@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
// src/users/users.controller.ts

@Post('upload-avatar')
@UseInterceptors(FileInterceptor('avatar'))
uploadAvatar(@UploadedFile() file) {
  // Save file and update user profile
}
