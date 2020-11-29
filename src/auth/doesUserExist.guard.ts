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
    const userExist = await this.userService.findOne(req.body);
    if (userExist)
      throw new HttpException('The email already exists', HttpStatus.CONFLICT);
    return true;
  }
}
