import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddTaskDto } from '../constants/task';
import { UserRequestJwt } from '../constants/user';
import { Task } from '@prisma/client';

@Controller('api/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async add(
    @Body() taskData: AddTaskDto,
    @Request() req: { user: UserRequestJwt },
  ): Promise<Task> {
    return this.taskService.createTask(taskData, req.user.uuid);
  }
}
