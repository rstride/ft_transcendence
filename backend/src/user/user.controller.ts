import { Controller, Get, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { SendMessageDto } from './dto/send-message.dto';


@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(@UploadedFile() file) {
    // Save file and update user profile
  }
}
