import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ColumnService } from './column.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Column } from '@prisma/client';
import { AddColumnDto, DeleteColumn, GetAllColumnsDto } from '../constants/column';

@Controller('api/column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async add(@Body() columnData: AddColumnDto): Promise<Column> {
    return this.columnService.createColumn(columnData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAll/:boardUuid/:status')
  async getColumns(@Param() param: GetAllColumnsDto): Promise<Column[]> {
    return this.columnService.findColumns(param.boardUuid, param.status);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:columnUuid')
  async delete(@Param() param: DeleteColumn): Promise<Column> {
    return this.columnService.deleteColumn(param.columnUuid);
  }
}
