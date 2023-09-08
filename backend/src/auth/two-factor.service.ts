import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';

@Injectable()
export class TwoFactorService {
  generateTwoFactorSecret() {
    // your code
  }

  validateTwoFactorToken(twoFactorSecret: string, twoFactorToken: string) {
    // your code
  }
}
