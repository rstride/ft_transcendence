import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants/constants';
import { UsersService } from 'src/models/users/users.service';
import { UserDto } from 'src/models/users/dto/user.dto';
import { Request } from 'express';

// The jwt2fa strategy checks if the token extracted from the request is a valid token
// It is different from the other jwtStrategy because it enables us to access the 2fa verification.
@Injectable()
export class JwtTwoFactAuthStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: getCookie,
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any): Promise<UserDto> {
    const user: UserDto = await this.userService.findOneById(payload.sub);
    
    return user;
  }
}

var getCookie = function(req: Request) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  return token;
}