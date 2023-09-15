// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-42';
// import { ConfigService } from '@nestjs/config';
// import { Request } from 'express';

// @Injectable()
// export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
//   constructor(private readonly configService: ConfigService) {
//     super({
//       clientID: configService.get<string>('FORTYTWO_CLIENT_ID'),
//       clientSecret: configService.get<string>('FORTYTWO_CLIENT_SECRET'),
//       callbackURL: configService.get<string>('FORTYTWO_CALLBACK_URL'),
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
// }