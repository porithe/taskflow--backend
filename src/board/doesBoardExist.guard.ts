import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BoardService } from './board.service';

@Injectable()
export class DoesBoardExistGuard implements CanActivate {
  constructor(private readonly boardService: BoardService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    return this.validateRequest(req);
  }

  async validateRequest(req: { body: { boardUuid: string } }) {
    if (!(await this.boardService.isBoardExist(req.body.boardUuid)))
      throw new HttpException('Board not found.', HttpStatus.NOT_FOUND);
    return true;
  }
}
