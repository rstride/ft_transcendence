import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/models/users/users.module';
import { AuthService } from './auth.service';
import { FortyTwoStrategy } from './strategies/42.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { JwtTwoFactAuthStrategy } from './strategies/jwt-2fa.strategy';
import { AuthGateway } from './auth.gateway';

@Module({
  imports: [
    UsersModule, 
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    })
  ],
  providers: [
    AuthService,
    FortyTwoStrategy, 
    JwtStrategy,
    JwtTwoFactAuthStrategy,
    AuthGateway
  ],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
