import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserCreateInput, UserWhereUniqueInput } from '@prisma/client';

interface GetFullName {
  fullName: string;
}

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserProfile(userUuid: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          uuid: userUuid,
        },
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND)
      }
      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }
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
  async getFullName(userUuid: string): Promise<GetFullName> {
    const user = await this.prisma.user.findUnique({
      where: {
        uuid: userUuid,
      },
    });
    if (!user) throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    return {
      fullName: `${user.firstName} ${user.lastName}`,
    };
  }
}
