import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ColumnService } from './column.service';

@Injectable()
export class DoesColumnExistGuard implements CanActivate {
  constructor(private readonly columnService: ColumnService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    return this.validateRequest(req);
  }

  async validateRequest(req: { body: any }) {
    if (!(await this.columnService.isColumnExist(req.body.columnUuid)))
      throw new HttpException('Column not found.', HttpStatus.NOT_FOUND);
    return true;
  }
}
