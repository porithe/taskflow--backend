import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post, Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ColumnService } from './column.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Column } from '@prisma/client';
import {
  AddColumnDto,
  DeleteColumnDto,
  GetAllColumnsDto, UpdateColumnDto,
} from '../constants/column';
import { UserRequestJwt } from '../constants/user';
import { DoesColumnExistGuard } from './doesColumnExist.guard';
import { DoesBoardExistGuard } from '../board/doesBoardExist.guard';

@Controller('api/column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @UseGuards(JwtAuthGuard)
  @UseGuards(DoesBoardExistGuard)
  @Post('add')
  async add(
    @Body() columnData: AddColumnDto,
    @Request() req: { user: UserRequestJwt },
  ): Promise<Column> {
    return this.columnService.createColumn(columnData, req.user.uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAll/:boardUuid/:status')
  async getColumns(
    @Param() param: GetAllColumnsDto,
    @Request() req: { user: UserRequestJwt },
  ): Promise<Column[]> {
    return this.columnService.findColumns(
      param.boardUuid,
      param.status,
      req.user.uuid,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(DoesColumnExistGuard)
  @Delete('delete')
  async delete(
    @Body() columnData: DeleteColumnDto,
    @Request() req: { user: UserRequestJwt },
  ): Promise<Column> {
    return this.columnService.deleteColumn(columnData, req.user.uuid);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(DoesColumnExistGuard)
  @Put('rename')
  async updateColumn(
    @Body() columnData: UpdateColumnDto,
    @Request() req: { user: UserRequestJwt },
  ): Promise<Column> {
    return this.columnService.editName(columnData, req.user.uuid);
  }
}
