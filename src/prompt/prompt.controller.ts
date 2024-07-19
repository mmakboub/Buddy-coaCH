import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@Controller('prompt')
@ApiTags('Prompt')
export class PromptController {
  constructor(private prompt: PromptService) {}

  @Post('user-responses')
  async addResponses(@Body() requestBody: { userId: number, questionsWithResponses: { question: string, response: string }[] }): Promise<User> {
    try{
    const { userId, questionsWithResponses } = requestBody;
    return this.prompt.addResponses(userId, questionsWithResponses);
  }
  catch(error){
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  }
}
}
