import { Module } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { PrismaService } from '../prisma/prisma.service';
import { BoardService } from '../board/board.service';

@Module({
  providers: [ColumnService, PrismaService, BoardService],
  controllers: [ColumnController],
})
export class ColumnModule {}
