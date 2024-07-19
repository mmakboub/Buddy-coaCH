import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
// import { QuestionModule } from './question/question.module';
// import { QuestionController } from './question/question.controller';
// import { QuestionService } from './question/question.service';
import { PrismaService } from './prisma/prisma.service';
import { PromptService } from './prompt/prompt.service';
import { PromptController } from './prompt/prompt.controller';
import { PromptModule } from './prompt/prompt.module';
// import { PayementModule } from './payement/payement.module';
// import { PayementController } from './payement/payement.controller';
// import { PayementService } from './payement/payement.service';
import { ChatModule } from './chat/chat.module';
import { ChatService } from './chat/chat.service';
import { ChatController } from './chat/chat.controller';
import { ChatbootModule } from './chatboot/chatboot.module';
import { ChatbootController } from './chatboot/chatboot.controller';
import { ChatbootService } from './chatboot/chatboot.service';
import { ProfileModule } from './profile/profile.module';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [UsersModule,HttpModule, PrismaModule, ConfigModule.forRoot({isGlobal: true}),PromptModule, ChatModule, ChatbootModule, ProfileModule, AuthModule ],
  controllers: [UsersController, PromptController, ChatController,ChatbootController],
  providers: [UsersService, PromptService, PrismaService, ChatService, ChatbootService],
})
export class AppModule {}
