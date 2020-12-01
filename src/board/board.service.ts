import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Board } from '@prisma/client';
import { BoardData } from '../constants/board';

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) {}

  async createBoard(boardData: BoardData, uuid: string) {
    try {
      return await this.prisma.board.create({
        data: {
          name: boardData.name,
          users: {
            connect: {
              uuid,
            },
          },
        },
      });
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }
  async findBoards(userUuid: string): Promise<Board[]> {
    try {
      return await this.prisma.board.findMany({
        where: {
          users: {
            every: {
              uuid: userUuid,
            },
          },
        },
      });
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async isBoardExist(uuid: string) {
    const board = await this.prisma.board.findUnique({
      where: {
        uuid,
      },
    });
    return !!board;
  }
}
