import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/models/users/dto/user.dto';
import { UsersService } from 'src/models/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/models/users/dto/create-user.dto';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import { Socket, Server } from 'socket.io';
import { parse } from 'cookie';
import { UserStatus } from 'src/models/users/entities/user.entity';

@Injectable()
export class AuthService {
  private userSessions: Map<number, Socket[]>;

  constructor(private usersService: UsersService, private jwtService: JwtService) {
    this.userSessions = new Map();
  }

  async fetchUser(user: any): Promise<UserDto> {
    const userDto: UserDto | null = await this.usersService.findOneById(user.id);

    return userDto;
  }

  //  Create a new user in database.
  async signup(user: any): Promise<UserDto> {
    const createUserDto = new CreateUserDto();

    createUserDto.name = user.name;
    createUserDto.photoUrl = user.photoUrl;
    createUserDto.id = user.id;

    const userDto = await this.usersService.create(createUserDto);

    return userDto;
  }

  //  Generate jwt token
  async generateToken(payload: any, options: any = {}) {
    return this.jwtService.sign(payload, options);
  }

  //  Generate a secret and an url
  async generateTwoFactAuthSecret(user: any): Promise<any> {
    const secret = authenticator.generateSecret();
    await this.usersService.updateSecret(user.id, secret);

    const otpauthUrl = authenticator.keyuri(user.id.toString(), 'ft_transcendence', secret);

    return otpauthUrl;
  }

  //  Url to qr code
  async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  //  Verify qr code scan
  async verifyTwoFactAuth(code: string, user: any) {
    const secret = await this.usersService.getSecret(user.id);
    return authenticator.verify({ token: code, secret: secret });
  }

  async turnOnTfa(user: any) {
    await this.usersService.turnOnTfa(user.id);
  }

  async modifyUserState(userDto: UserDto, status: UserStatus) {
    await this.usersService.setStatus(userDto.id, status);
  }

  async addToConnection(client: Socket, server: Server) {
    const userDto: UserDto | null = await this.getUserFromSocket(client);

    if (!userDto) {
      return;
    }

    let sockets = this.userSessions.get(userDto.id);

    if (!sockets || sockets.length === 0) {
      sockets = [];
      await this.modifyUserState(userDto, UserStatus.Online);
      server.emit('onUserChange');
    }
    sockets.push(client);
    this.userSessions.set(userDto.id, sockets);
    client.join('user_' + userDto.id.toString());
  }

  async removeFromConnection(client: Socket, server: Server) {
    const userDto: UserDto | null = await this.getUserFromSocket(client);

    if (!userDto) {
      return;
    }

    let sockets = this.userSessions.get(userDto.id);
    if (!sockets) {
      return ;
    }
    const index = sockets.indexOf(client);
    if (index > -1) {
      sockets.splice(index, 1);
    }

    if (!sockets || sockets.length === 0) {
      await this.modifyUserState(userDto, UserStatus.Offline);
      server.emit('onUserChange');
    }

    this.userSessions.set(userDto.id, sockets);
  }

  async clearSession(userDto: UserDto) {
    this.userSessions.delete(userDto.id);
    await this.modifyUserState(userDto, UserStatus.Offline);
  }

  public isUserConnected(userId: number): boolean {
    if (!this.userSessions.get(userId) || this.userSessions.get(userId).length == 0) {
      return false;
    }
    return true;
  }

  public async getUserFromSocket(socket: Socket): Promise<UserDto | null> {
    const cookies = socket.handshake.headers.cookie;

    if (!cookies) {
      return null;
    }

    const token = parse(cookies)['jwt'];
    if (!token) {
      return null;
    }

    try {
      const sub = this.jwtService.verify(token);
      if (!sub) {
        return null;
      }

      const userDto: UserDto | null = await this.usersService.findOneById(sub.sub);

      return userDto;
    } catch {
      return null;
    }
  }

  getSocketsFromUser(userId: number): Socket[] {
    return this.userSessions.get(userId);
  }
}
