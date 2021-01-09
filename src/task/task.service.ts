import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AddTaskDto,
  DeleteTaskDto,
  EditTaskDto,
  MoveTaskDto,
  UpdateRelationDto,
} from '../constants/task';
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

  async moveTask(taskUuid: string, position: number): Promise<any> {
    return this.prisma.task.update({
      data: {
        position,
      },
      where: {
        uuid: taskUuid,
      },
    });
  }

  async moveTasks(
    { boardUuid, taskUuid, newPosition, oldPosition, columnUuid }: MoveTaskDto,
    userUuid: string,
  ): Promise<{ success: boolean }> {
    try {
      if (!(await this.boardService.isUserOwnerOfBoard(boardUuid, userUuid))) {
        throw new HttpException('Forbidden.', HttpStatus.FORBIDDEN);
      }
      const column = await this.prisma.column.findUnique({
        where: {
          uuid: columnUuid,
        },
        include: {
          tasks: {
            where: {
              status: Status.ACTIVE,
            },
          },
        },
      });
      if (column) {
        await this.moveTask(taskUuid, newPosition);
        for (const task of column.tasks) {
          if (task.uuid !== taskUuid) {
            if (task.position === newPosition && newPosition < oldPosition) {
              await this.moveTask(task.uuid, task.position + 1);
            } else if (
              task.position > newPosition &&
              task.position < oldPosition
          ) {
              await this.moveTask(task.uuid, task.position + 1);
            } else if (
              task.position === newPosition &&
              newPosition > oldPosition
            ) {
              await this.moveTask(task.uuid, task.position - 1);
            }
          }
        }
      }
      return {
        success: true,
      };
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async updateRelation({ boardUuid, taskUuid, columnUuid }: UpdateRelationDto, userUuid: string): Promise<Task> {
    try {
      if (!(await this.boardService.isUserOwnerOfBoard(boardUuid, userUuid))) {
        throw new HttpException('Forbidden.', HttpStatus.FORBIDDEN);
      }
      return await this.prisma.task.update({
        where: { uuid: taskUuid },
        data: {
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
}
