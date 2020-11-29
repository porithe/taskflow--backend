import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { UserService } from '../user/user.service';
import { CreatedUser, LoginUserData, RegisterUserData, UserLoggedIn } from '../constants/user';
import { User } from '@prisma/client';

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
        id: createdUser.id,
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
      return null;
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async login(user: LoginUserData): Promise<UserLoggedIn> {
    const payload = { user, sub: user.id };
    return {
      id: user.id,
      username: user.username,
      accessToken: this.jwtService.sign(payload),
    };
  }

  validateToken(token: string) {
    return this.jwtService.verify(token);
  }
}
