
// import { Controller, Get, HttpStatus, Post } from '@nestjs/common';
// import { QuestionService } from './question.service';
// import { PrismaService } from 'src/prisma/prisma.service';

// @Controller('questions')
// export class QuestionController {
//   constructor(private readonly questionService: QuestionService , private readonly prisma : PrismaService) {}

//   @Get('seed')
//   async promptQuestions() {
//     console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");
//     console.log("qus", this.prisma.question);
//     const jsonFilePath = './question.json';
//     const statusCode = await this.questionService.promptQuestionsFromJSON(jsonFilePath);
//     if (statusCode === HttpStatus.CREATED) {
//         const allQuestions = await this.questionService.getAllQuestions();
//         return allQuestions;
//       }
//       return { message: 'Failed to seed questions' }
//   }
// }