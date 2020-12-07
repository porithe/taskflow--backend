import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { ColumnService } from '../column/column.service';
import { BoardService } from '../board/board.service';

@Module({
  providers: [
    TaskService,
    PrismaService,
    UserService,
    ColumnService,
    BoardService,
  ],
  controllers: [TaskController],
})
export class TaskModule {}
