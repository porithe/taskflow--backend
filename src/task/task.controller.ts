import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Put,
  Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddTaskDto, DeleteTaskDto, EditTaskDto } from '../constants/task';
import { UserRequestJwt } from '../constants/user';
import { Task } from '@prisma/client';
import { DoesTaskExistGuard } from './doesTaskExist.guard';

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

  @UseGuards(JwtAuthGuard)
  @Put('edit')
  async edit(
    @Body() taskData: EditTaskDto,
    @Request() req: { user: UserRequestJwt },
  ): Promise<Task> {
    return this.taskService.editTask(taskData, req.user.uuid);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(DoesTaskExistGuard)
  @Delete('delete')
  async delete(
    @Body() taskData: DeleteTaskDto,
    @Request() req: { user: UserRequestJwt },
  ): Promise<Task> {
    return this.taskService.deleteTask(taskData, req.user.uuid);
  }
}
