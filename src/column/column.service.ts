import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Column } from '@prisma/client';
import { ColumnData } from '../constants/column';
import { StatusStrings } from '../constants/status';

@Injectable()
export class ColumnService {
  constructor(private prisma: PrismaService) {}

  async createColumn(columnData: ColumnData): Promise<Column> {
    try {
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
  ): Promise<Column[]> {
    try {
      return await this.prisma.column.findMany({
        where: {
          boardUuid,
          status
        },
      });
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async deleteColumn(columnUuid: string): Promise<Column> {
    try {
      const status = 'DELETED';
      return await this.prisma.column.update({
        where: {
          uuid: columnUuid,
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
}
