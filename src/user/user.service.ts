import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserCreateInput, UserWhereUniqueInput } from '@prisma/client';

enum ErrorMessages {
  USER_NOT_FOUND = 'User not found.',
}

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: UserCreateInput): Promise<User> {
    try {
      data.password = await hash(data.password, Number(process.env.SALT));
      return await this.prisma.user.create({
        data,
      });
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }
  async findOne(
    userWhereUniqueInput: UserWhereUniqueInput,
  ): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          username: userWhereUniqueInput.username,
        },
      });
      if (user) return user;
      throw new HttpException(
        ErrorMessages.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }
}
