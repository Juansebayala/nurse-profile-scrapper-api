import { Module } from '@nestjs/common';
import { PrismaService } from './infrastructure/prisma/prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class CommonModule {}
