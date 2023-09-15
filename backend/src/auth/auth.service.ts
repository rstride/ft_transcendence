// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-42';
// import { ConfigService } from '@nestjs/config';
// import { Request } from 'express';

// @Injectable()
// export class AuthService extends PassportStrategy(Strategy, '42') {
//   constructor(private readonly configService: ConfigService) {
//     super({
//       clientID: configService.get<string>('42_CLIENT_ID'),
//       clientSecret: configService.get<string>('42_CLIENT_SECRET'),
//       callbackURL: configService.get<string>('42_CALLBACK_URL'),
//       scope: ['public'],
//     });
//   }

//   async validate(request: Request, accessToken: string, refreshToken: string, profile: any, done: Function) {
//     const user = {
//       accessToken,
//       refreshToken,
//       profile,
//     };
//     done(null, user);
//   }

//   getLoginUrl() {
//     const baseUrl = 'https://api.intra.42.fr/oauth/authorize';
//     const clientId = this.configService.get<string>('42_CLIENT_ID');
//     const callbackUrl = this.configService.get<string>('42_CALLBACK_URL');
//     const scope = 'public';
//     const state = 'random-state-string';
//     const url = `${baseUrl}?client_id=${clientId}&redirect_uri=${callbackUrl}&scope=${scope}&state=${state}&response_type=code`;
//     return url;
//   }
// }