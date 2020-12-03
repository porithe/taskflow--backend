import { Module } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [OwnerService, PrismaService],
})
export class OwnerModule {}
