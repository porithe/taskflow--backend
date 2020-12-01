import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ColumnService } from './column.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Column } from '@prisma/client';
import {
  AddColumnDto,
  DeleteColumn,
  GetAllColumnsDto,
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
    @Request() req: { body: UserRequestJwt },
  ): Promise<Column> {
    return this.columnService.createColumn(columnData, req.body.uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAll/:boardUuid/:status')
  async getColumns(
    @Param() param: GetAllColumnsDto,
    @Request() req: { body: UserRequestJwt },
  ): Promise<Column[]> {
    return this.columnService.findColumns(
      param.boardUuid,
      param.status,
      req.body.uuid,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(DoesColumnExistGuard)
  @Delete('delete')
  async delete(
    @Body() columnData: DeleteColumn,
    @Request() req: { body: UserRequestJwt },
  ): Promise<Column> {
    return this.columnService.deleteColumn(columnData, req.body.uuid);
  }
}
