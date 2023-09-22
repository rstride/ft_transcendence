import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { VerifiedCallback } from 'passport-jwt';

//  auth42 strategy
@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {

  
  // The super function calls the 42 strategy constructor with our envir variables.
  // It will asks for user permissions before calling validate().
  
  constructor() {
    super({
      clientID: process.env.FORTYTWO_ID,
      clientSecret: process.env.FORTYTWO_APP_SECRET,
      callbackURL: process.env.AUTH_CALLBACK,
    });
  }

  // The validate function is a verify function called by the PassportStrategy.
  // It receives the necessary informations and a function redirecting to the callbackURL.

  // We won't need the tokens since we need the profile only once. 
  // It is used to access the user informations of 42 API after the first access. 
  // (And I don't know if 42 API uses them).

  async validate(
    accessToken: string, 
    refreshToken: string, 
    profile: any,
    done: VerifiedCallback
    ): Promise<any> {

    const user = {
      id: profile.id,
      name: profile.username,
      photoUrl: profile.photos[0].value,
    }

    done(null, user);
  }
}