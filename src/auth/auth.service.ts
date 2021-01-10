import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { UserService } from '../user/user.service';
import {
  CreatedUser,
  LoginUserData,
  RegisterUserData,
  UserLoggedIn,
} from '../constants/user';
import { User } from '@prisma/client';

enum ErrorMessages {
  USER_NOT_FOUND = 'User not found.',
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async register(user: RegisterUserData): Promise<CreatedUser> {
    try {
      const createdUser = await this.userService.createUser(user);
      return {
        uuid: createdUser.uuid,
        username: createdUser.username,
        email: createdUser.email,
        createdAt: createdUser.createdAt,
      };
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    try {
      const user = await this.userService.findOne({ username });
      if (user && compareSync(password, user.password)) return user;
      if (!user) {
        throw new HttpException(
          ErrorMessages.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      return null;
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async login(user: LoginUserData): Promise<UserLoggedIn> {
    const payload = { user, sub: user.uuid };
    return {
      uuid: user.uuid,
      username: user.username,
      accessToken: this.jwtService.sign(payload),
    };
  }

  validateToken(token: string) {
    return this.jwtService.verify(token);
  }
}
