import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddTaskDto, DeleteTaskDto, EditTaskDto } from '../constants/task';
import { Task } from '@prisma/client';
import { UserService } from '../user/user.service';
import { ColumnService } from '../column/column.service';
import { BoardService } from '../board/board.service';
import { Status } from '../constants/status';

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private readonly boardService: BoardService,
    private readonly userService: UserService,
    private readonly columnService: ColumnService,
  ) {}

  async createTask(
    { boardUuid, title, columnUuid, description }: AddTaskDto,
    userUuid: string,
  ): Promise<Task> {
    try {
      if (!(await this.boardService.isUserOwnerOfBoard(boardUuid, userUuid))) {
        throw new HttpException('Forbidden.', HttpStatus.FORBIDDEN);
      }
      const { fullName } = await this.userService.getFullName(userUuid);
      return await this.prisma.task.create({
        data: {
          title,
          description,
          author: fullName,
          position: await this.columnService.lengthOfColumn(columnUuid),
          column: {
            connect: {
              uuid: columnUuid,
            },
          },
        },
      });
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async isTaskExist(taskUuid: string): Promise<boolean> {
    const task = await this.prisma.task.findUnique({
      where: {
        uuid: taskUuid,
      },
    });
    return !!task;
  }

  async editTask(
    { taskUuid, boardUuid, title, description }: EditTaskDto,
    userUuid: string,
  ): Promise<Task> {
    try {
      if (!(await this.boardService.isUserOwnerOfBoard(boardUuid, userUuid))) {
        throw new HttpException('Forbidden.', HttpStatus.FORBIDDEN);
      }
      return await this.prisma.task.update({
        where: {
          uuid: taskUuid,
        },
        data: {
          title,
          description,
        },
      });
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async deleteTask(
    { taskUuid, boardUuid }: DeleteTaskDto,
    userUuid: string,
  ): Promise<Task> {
    try {
      if (!(await this.boardService.isUserOwnerOfBoard(boardUuid, userUuid))) {
        throw new HttpException('Forbidden.', HttpStatus.FORBIDDEN);
      }
      return await this.prisma.task.update({
        where: {
          uuid: taskUuid,
        },
        data: {
          status: Status.DELETED,
        },
      });
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }
}
