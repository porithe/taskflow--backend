import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { AddBoardDto } from '../constants/board';
import { Board } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRequestJwt } from '../constants/user';

@Controller('api/board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async add(
    @Body() userData: AddBoardDto,
    @Request() req: { user: UserRequestJwt },
  ): Promise<Board> {
    return this.boardService.createBoard(userData, req.user.uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAll')
  async getBoards(@Request() req: { user: UserRequestJwt }): Promise<Board[]> {
    return this.boardService.findBoards(req.user.uuid);
  }
}
