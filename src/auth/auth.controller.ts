import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { DoesUserExistGuard } from './doesUserExist.guard';
import { CreatedUser, LoginUserData, RegisterUserData } from '../constants/user';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(DoesUserExistGuard)
  @Post('auth/register')
  async register(@Body() userData: RegisterUserData): Promise<CreatedUser> {
    return this.authService.register(userData);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req: { user: LoginUserData }) {
    return this.authService.login(req.user);
  }
}
