import { Body, Controller, Post } from '@nestjs/common';
import { BoardService } from './board.service';

@Controller('api/board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post('add')
  async add(@Body() userData: any): Promise<any> {
    return this.boardService.createBoard(userData);
  }
}
