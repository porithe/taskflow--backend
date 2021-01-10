import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRequestJwt } from '../constants/user';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: { user: UserRequestJwt }): Promise<any> {
    return this.userService.getUserProfile(req.user.uuid);
  }
}
