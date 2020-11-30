import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BoardService } from './board.service';
import { AddBoardDto, GetAllDto } from '../constants/board';
import { Board } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async add(@Body() userData: AddBoardDto): Promise<Board> {
    return this.boardService.createBoard(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAll/:userUuid')
  async getBoards(@Param() param: GetAllDto): Promise<Board[]> {
    return this.boardService.findBoards(param.userUuid);
  }
}
