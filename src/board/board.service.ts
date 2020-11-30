import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface BoardData {
  userUuid: string;
  name: string;
}

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) {}

  async createBoard(boardData: BoardData) {
    try {
      return await this.prisma.board.create({
        data: {
          name: boardData.name,
          users: {
            connect: {
              uuid: boardData.userUuid,
            },
          },
        },
      });
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }
}
