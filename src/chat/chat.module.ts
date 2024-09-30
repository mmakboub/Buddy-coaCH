import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ChatService, PrismaService],
  exports: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}