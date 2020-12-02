import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { AddBoardDto, UpdateBoardDto } from '../constants/board';
import { Board } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRequestJwt } from '../constants/user';
import { DoesBoardExistGuard } from './doesBoardExist.guard';

@Controller('api/board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async add(
    @Body() boardData: AddBoardDto,
    @Request() req: { user: UserRequestJwt },
  ): Promise<Board> {
    return this.boardService.createBoard(boardData, req.user.uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAll')
  async getBoards(@Request() req: { user: UserRequestJwt }): Promise<Board[]> {
    return this.boardService.findBoards(req.user.uuid);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(DoesBoardExistGuard)
  @Put('rename')
  async updateBoard(
    @Body() boardData: UpdateBoardDto,
    @Request() req: { user: UserRequestJwt },
  ): Promise<Board> {
    return this.boardService.editName(boardData, req.user.uuid);
  }
}
