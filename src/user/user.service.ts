import { HttpException, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserCreateInput, UserWhereUniqueInput } from '@prisma/client';

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
      return await this.prisma.user.findUnique({
        where: {
          username: userWhereUniqueInput.username,
        },
      });
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }
  async isUsernameInUse(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
    return !!user;
  }
  async isEmailInUse(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return !!user;
  }
}
