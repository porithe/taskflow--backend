import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Column } from '@prisma/client';
import {
  ColumnData,
  DeleteColumnData,
  UpdateColumnDto,
} from '../constants/column';
import { Status, StatusStrings } from '../constants/status';
import { BoardService } from '../board/board.service';

@Injectable()
export class ColumnService {
  constructor(
    private prisma: PrismaService,
    private readonly boardService: BoardService,
  ) {}

  async createColumn(
    columnData: ColumnData,
    userUuid: string,
  ): Promise<Column> {
    try {
      if (
        !(await this.boardService.isUserOwnerOfBoard(
          columnData.boardUuid,
          userUuid,
        ))
      ) {
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
      if (!(await this.boardService.isUserOwnerOfBoard(boardUuid, userUuid))) {
        throw new HttpException('Forbidden.', HttpStatus.FORBIDDEN);
      }
      return await this.prisma.column.findMany({
        where: {
          boardUuid,
          status,
        },
        include: {
          tasks: {
            where: {
              status: Status.ACTIVE,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
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
      if (
        !(await this.boardService.isUserOwnerOfBoard(
          columnData.boardUuid,
          userUuid,
        ))
      ) {
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

  async isColumnExist(uuid: string) {
    const column = await this.prisma.column.findUnique({
      where: {
        uuid,
      },
    });
    return !!column;
  }

  async editName(
    columnData: UpdateColumnDto,
    userUuid: string,
  ): Promise<Column> {
    try {
      if (
        !(await this.boardService.isUserOwnerOfBoard(
          columnData.boardUuid,
          userUuid,
        ))
      ) {
        throw new HttpException('Forbidden.', HttpStatus.FORBIDDEN);
      }
      return await this.prisma.column.update({
        where: {
          uuid: columnData.columnUuid,
        },
        data: {
          name: columnData.name,
        },
      });
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async lengthOfColumn(columnUuid: string): Promise<number> {
    const column = await this.prisma.column.findUnique({
      where: {
        uuid: columnUuid,
      },
      include: {
        tasks: true,
      },
    });
    if (!column) {
      throw new HttpException('Column not found.', HttpStatus.NOT_FOUND);
    }
    return column.tasks.length;
  }
}
