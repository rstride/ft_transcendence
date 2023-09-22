import { Controller, Get, UseGuards, Req, Res, Post, Body, UnauthorizedException, Delete, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { FortyTwoAuthGuard } from './guards/42-auth.guard';
import { Request, Response } from 'express';
import { UserDto } from 'src/models/users/dto/user.dto';
import { JwtTwoFactAuthGuard } from './guards/jwt-2fa.guard';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

    // This function is used to login thanks to the guard.
    @UseGuards(FortyTwoAuthGuard)
    @Get('login')
    async login() {}
    
    // Function called by 42 strategy
    @UseGuards(FortyTwoAuthGuard)
    @Get('42/callback')
    async fortyTwoAuthCallback(
      @Req() req: Request,
      @Res({passthrough: true}) res: Response,
      ) {
      //  Find user or signup if does not exist
      let userDto: UserDto = await this.authService.fetchUser(req.user);

      //  If the user is not registered in our database, we create one.
      if (!userDto) {
        userDto = await this.authService.signup(req.user);
      }

      //  Create and store jwt token to enable connection
      const accessToken = await this.authService.generateToken({ 
        sub: userDto.id, 
        IsTwoFactAuth: false
      });

      res.cookie('jwt', accessToken, { httpOnly: true, sameSite: 'strict' });
    
      //  Redirect to the frontend
      res.redirect(process.env.FRONT_URL);
    }

    @UseGuards(JwtTwoFactAuthGuard)
    @Get('isLogged')
    async isLoggedIn() {
      return {loggedIn: true};
    }
  
    // User logout
    @UseGuards(JwtTwoFactAuthGuard)
    @HttpCode(204)
    @Delete('logout')
    async logout(
      @Res({passthrough: true}) response: Response,
      @Req() req: Request,
      ) {
      response.clearCookie('jwt', { httpOnly: true, sameSite: 'strict' });
      const user: any = req.user;
      await this.authService.clearSession(user);
    }
    
    // Generate QrCode
    @UseGuards(JwtAuthGuard)
    @Get('2fa/generate')
    async generate(@Req() req: Request, @Res() res: Response) {
      
      //  Generate a new token // To change so it can verify if the setup is ok
      const user: any = req.user;

      //  Generate the secret for the user and the qrCode
      const otpauthUrl = await this.authService.generateTwoFactAuthSecret(user);
      const qrCode = await this.authService.pipeQrCodeStream(res, otpauthUrl);
      return qrCode;
    }
    
    // Qr code auth verification
    @UseGuards(JwtTwoFactAuthGuard)
    @Post('2fa/validate')
    async verifyTwoFactAuth(
      @Req() req: Request, 
      @Body() body, 
      @Res({ passthrough: true }) res: Response
      ) {
      const user: any = req.user;
      const isCodeValid = await this.authService.verifyTwoFactAuth(body.code, user);

      if (!isCodeValid) {
        if (user.twoFactAuth === false) {
          return {valid: false};
        }
        throw new UnauthorizedException('Wrong authentication code');
      }
      
      if (user.twoFactAuth == false) {
        await this.authService.turnOnTfa(user);
      }

      //  Create and store jwt token to enable connection
      const accessToken = await this.authService.generateToken({
        sub: user.id,
        isTwoFactAuth: true,
      });
      
      res.cookie('jwt', accessToken, { httpOnly: true, sameSite: 'strict' });

      return {valid: true};
    }
  }