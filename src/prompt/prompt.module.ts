import { Module } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { PromptController } from './prompt.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [PromptService, PrismaService],
  controllers: [PromptController]
})
export class PromptModule {}
