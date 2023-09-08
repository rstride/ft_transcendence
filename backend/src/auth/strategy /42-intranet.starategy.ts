// src/auth/strategy/42-intranet.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';

@Injectable()
export class Intranet42Strategy extends PassportStrategy(Strategy, '42') {
  constructor() {
    super({
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: process.env.INTRA_42_CLIENT_ID,
      clientSecret: process.env.INTRA_42_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/42/callback',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    // Validate and save user information
  }
}
