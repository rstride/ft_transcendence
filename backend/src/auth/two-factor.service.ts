// import { Injectable } from '@nestjs/common';
// import * as speakeasy from 'speakeasy';
// import { AuthService } from './auth.service';
// import { UserService } from './user.service';

// @Injectable()
// export class TwoFactorService {
//   constructor(
//     private authService: AuthService,
//     private userService: UserService,
//   ) {}

//   generateTwoFactorSecret() {
//     // your code
//   }

//   validateTwoFactorToken(twoFactorSecret: string, twoFactorToken: string) {
//     // your code
//   }

//   async getUserData(accessToken: string) {
//     return this.userService.getUserData(accessToken);
//   }
// }