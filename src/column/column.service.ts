import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Column } from '@prisma/client';
import { ColumnData, DeleteColumnData } from '../constants/column';
import { StatusStrings } from '../constants/status';

@Injectable()
export class ColumnService {
  constructor(private prisma: PrismaService) {}

  async createColumn(
    columnData: ColumnData,
    userUuid: string,
  ): Promise<Column> {
    try {
      if (!(await this.isUserOwnerOfBoard(columnData.boardUuid, userUuid))) {
        throw new HttpException('Forbidden.', HttpStatus.FORBIDDEN);
      }
      return await this.prisma.column.create({
        data: {
          name: columnData.name,
          board: {
            connect: {
              uuid: columnData.boardUuid,
            },
          },
        },
      });
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async findColumns(
    boardUuid: string,
    status: StatusStrings,
    userUuid: string,
  ): Promise<Column[]> {
    try {
      if (!(await this.isUserOwnerOfBoard(boardUuid, userUuid))) {
        throw new HttpException('Forbidden.', HttpStatus.FORBIDDEN);
      }
      return await this.prisma.column.findMany({
        where: {
          boardUuid,
          status,
        },
      });
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async deleteColumn(
    columnData: DeleteColumnData,
    userUuid: string,
  ): Promise<Column> {
    try {
      if (!(await this.isUserOwnerOfBoard(columnData.boardUuid, userUuid))) {
        throw new HttpException('Forbidden.', HttpStatus.FORBIDDEN);
      }
      const status = 'DELETED';
      return await this.prisma.column.update({
        where: {
          uuid: columnData.columnUuid,
        },
        data: {
          status,
        },
      });
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async isUserOwnerOfBoard(
    boardUuid: string,
    userUuid: string,
  ): Promise<boolean> {
    const board = await this.prisma.column.findMany({
      select: {
        uuid: true,
        name: true,
        createdAt: true,
        boardUuid: true,
        board: {
          include: {
            users: {
              select: {
                uuid: true,
              },
            },
          },
        },
      },
      where: {
        boardUuid,
        board: {
          users: {
            some: {
              uuid: userUuid,
            },
          },
        },
      },
    });
    return !!board;
  }

  async isColumnExist(uuid: string) {
    const column = await this.prisma.column.findUnique({
      where: {
        uuid,
      },
    });
    return !!column;
  }
}
