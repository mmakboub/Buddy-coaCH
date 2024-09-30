import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { ChatService } from 'src/chat/chat.service';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [UsersModule,ChatModule], 
  providers: [ProfileService,PrismaService],
  controllers: [ProfileController]
})
export class ProfileModule {}
