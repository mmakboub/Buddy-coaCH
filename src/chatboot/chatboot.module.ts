import { Module } from '@nestjs/common';
import { ChatbootController } from './chatboot.controller';
import { ChatbootService } from './chatboot.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ChatbootController],
  providers: [ChatbootService, PrismaService]
})
export class ChatbootModule {}
