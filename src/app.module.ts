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

@Module({
  imports: [UsersModule, PrismaModule, ConfigModule.forRoot({isGlobal: true}),PromptModule, ChatModule ],
  controllers: [UsersController, PromptController, ChatController],
  providers: [UsersService, PromptService, PrismaService, ChatService],
})
export class AppModule {}
