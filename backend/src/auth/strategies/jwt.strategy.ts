import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants/constants';
import { UsersService } from 'src/models/users/users.service';
import { UserDto } from 'src/models/users/dto/user.dto';
import { Request } from 'express';

// The jwt strategy checks if the token extracted from the request is a valid token.
// It checks if the given token has been verified by the 2fa (if activated).
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: getCookie,
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any): Promise<UserDto | boolean> {
    const user: UserDto = await this.userService.findOneById(payload.sub);
    if (!user) {
      return false;
    }
    if (!user.twoFactAuth) {
      return user;
    }
    if (payload.isTwoFactAuth) {
      return user;
    }
  }
}

var getCookie = function(req: Request) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  return token;
}