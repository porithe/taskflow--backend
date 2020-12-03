import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddTaskDto } from '../constants/task';
import { Task } from '@prisma/client';
import { OwnerService } from '../owner/owner.service';
import { UserService } from '../user/user.service';
import { ColumnService } from '../column/column.service';

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private readonly ownerService: OwnerService,
    private readonly userService: UserService,
    private readonly columnService: ColumnService,
  ) {}

  async createTask(
    { boardUuid, title, columnUuid, description }: AddTaskDto,
    userUuid: string,
  ): Promise<Task> {
    try {
      const ownerData = {
        boardUuid,
        userUuid,
      };
      if (!(await this.ownerService.isUserOwnerOfBoard(ownerData))) {
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
}
