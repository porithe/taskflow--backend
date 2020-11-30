import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';
import { RegisterUserData } from '../constants/user';

@Injectable()
export class DoesUserExistGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    return this.validateRequest(req);
  }

  async validateRequest(req: { body: RegisterUserData }) {
    const isEmailInUse = await this.userService.isEmailInUse(req.body.email);
    const isUsernameInUse = await this.userService.isUsernameInUse(
      req.body.username,
    );
    if (isEmailInUse)
      throw new HttpException('The email already exists', HttpStatus.CONFLICT);
    if (isUsernameInUse)
      throw new HttpException(
        'The username already exists',
        HttpStatus.CONFLICT,
      );
    return true;
  }
}
