import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardDto } from '../constants/board';
import { Board } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async add(@Body() userData: BoardDto): Promise<Board> {
    return this.boardService.createBoard(userData);
  }
}
