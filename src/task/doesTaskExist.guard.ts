import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TaskService } from './task.service';

@Injectable()
export class DoesTaskExistGuard implements CanActivate {
  constructor(private readonly taskService: TaskService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    return this.validateRequest(req);
  }

  async validateRequest(req: { body: any }) {
    if (!(await this.taskService.isTaskExist(req.body.taskUuid)))
      throw new HttpException('Task not found.', HttpStatus.NOT_FOUND);
    return true;
  }
}
