import { Controller, Get, Post, Body, Param, Delete, HttpCode, UseInterceptors, UploadedFile, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { AvatarDto } from '../avatars/dto/avatar.dto';
import { UserDto } from './dto/user.dto';
import { isNumber } from 'class-validator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Check if user is logged in and get user profile.
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async profile(@Req() req: Request) {
    const user: any = req.user;
    const userDto: UserDto = await this.usersService.findOneById(user.id);

    return userDto;
  }

  // Set the current user's avatar
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  public async getOneById(
    @Param('id') userId: string
    ) {

    if (!isNumber(+userId)) {
      return {};
    }

    const userDto = await this.usersService.findOneById(+userId);

    if (!userDto) {
      return {};
    }

    return userDto;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getAll() {
    const userDtos: UserDto[] = await this.usersService.findAll();

    return {users: userDtos};
  }

  @Post('/friend')
  @UseGuards(JwtAuthGuard)
  public async addFriend(
    @Req() req: Request,
    @Body() body: any
    ) {
      const user: any = req.user;
      const userDto: UserDto = await this.usersService.addFriend(user.id, body.id);

      return userDto;
  }

  @Delete('/friend')
  @UseGuards(JwtAuthGuard)
  public async removeFriend(
    @Req() req: Request,
    @Body() body: any
    ) {
      const user: any = req.user;
      const userDto: UserDto = await this.usersService.removeFriend(user.id, body.id);

      return userDto;
  }

  @Post('/blocked')
  @UseGuards(JwtAuthGuard)
  public async addBlocked(
    @Req() req: Request,
    @Body() body: any
    ) {
      const user: any = req.user;
      const userDto: UserDto = await this.usersService.addBlocked(user.id, body.id);

      return userDto;
  }

  @Delete('/blocked')
  @UseGuards(JwtAuthGuard)
  public async removeBlocked(
    @Req() req: Request,
    @Body() body: any
    ) {
      const user: any = req.user;
      const userDto: UserDto = await this.usersService.removeBlocked(user.id, body.id);

      return userDto;
  }
  
  // Update name
  @Post('/updateName')
  @UseGuards(JwtAuthGuard)
  public async updateName(
    @Req() req: Request,
    @Body() body: any
    ) {
      const user: any = req.user;
      const userDto: UserDto | null = await this.usersService.updateName(user.id, body.name);

      if (!userDto) {
        throw new UnauthorizedException();
      }

      return userDto;
  }

  @Post('/turnOffTfa')
  @UseGuards(JwtAuthGuard)
  public async turnOffTfa(
    @Req() req: Request,
  ) {
    const user: any = req.user;
    await this.usersService.turnOffTfa(user.id);

    const userDto: UserDto = await this.usersService.findOneById(user.id);

    return userDto;
  }

  // Create a new avatar for the user
  @Post('/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  public async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request
  ) {
    const user: any = req.user;
    const userDto: UserDto = await this.usersService.findOneById(user.id);
    await this.usersService.addAvatar(userDto, file.buffer);

    return userDto;
  }

  // Set the current user's avatar
  @Post('/avatar/:id')
  @UseGuards(JwtAuthGuard)
  public async updateCurrentAvatar(
    @Req() req: Request,
    @Param('id') avatarId: number
    ) {
    const user: any = req.user;
    const userDto = await this.usersService.findOneById(user.id);
    
    await this.usersService.updateCurrentAvatar(userDto, avatarId);

    return userDto;
  }

  // Get all user's avatars
  @Get('/avatars')
  @UseGuards(JwtAuthGuard)
  public async getAllAvatars(@Req() req: Request) {
    const user: any = req.user;
    const userDto = await this.usersService.findOneById(user.id);
    
    const avatarDtos: AvatarDto[] | null = await this.usersService.getAllAvatars(userDto);

    return avatarDtos? avatarDtos : [];
  }

  // Remove one avatar. Not in avatar controller to prevent circular depedency.
  @Delete('/avatar/:id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  public async removeAvatar(
    @Param('id') avatarId: number,
    @Req() req: Request
    ) {
    const user: any = req.user;
    await this.usersService.removeAvatar(avatarId, user.id);
  }
}
