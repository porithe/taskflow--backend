import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Board } from '@prisma/client';
import { BoardData, UpdateBoardDto } from '../constants/board';

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) {}

  async createBoard(boardData: BoardData, uuid: string): Promise<Board> {
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

  async findBoard(userUuid: string, boardUuid: string): Promise<Board> {
    try {
      const board = await this.prisma.board.findUnique({
        where: {
          uuid: boardUuid,
        },
      });
      if (!board)
        throw new HttpException('Board not found.', HttpStatus.NOT_FOUND);
      return board;
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

  async isBoardExist(uuid: string): Promise<boolean> {
    const board = await this.prisma.board.findUnique({
      where: {
        uuid,
      },
    });
    return !!board;
  }

  async isUserOwnerOfBoard(
    boardUuid: string,
    userUuid: string,
  ): Promise<boolean> {
    const board = await this.prisma.board
      .findUnique({
        where: {
          uuid: boardUuid,
        },
      })
      .users({
        where: {
          uuid: userUuid,
        },
      });
    return board?.length > 0 && board !== null;
  }

  async editName(boardData: UpdateBoardDto, userUuid: string): Promise<Board> {
    try {
      if (!(await this.isUserOwnerOfBoard(boardData.boardUuid, userUuid))) {
        throw new HttpException('Forbidden.', HttpStatus.FORBIDDEN);
      }
      return await this.prisma.board.update({
        where: {
          uuid: boardData.boardUuid,
        },
        data: {
          name: boardData.name,
        },
      });
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }
}
