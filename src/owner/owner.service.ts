import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface OwnerData {
  userUuid: string;
  boardUuid: string;
}

@Injectable()
export class OwnerService {
  constructor(private prisma: PrismaService) {}

  async isUserOwnerOfBoard(ownerData: OwnerData): Promise<boolean> {
    try {
      const board = await this.prisma.board
        .findUnique({
          where: {
            uuid: ownerData.boardUuid,
          },
        })
        .users({
          where: {
            uuid: ownerData.userUuid,
          },
        });
      return !!board;
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }
}
