// import { HttpStatus, Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
// import * as fs from 'fs';

// Injectable()
// export class QuestionService {
//     constructor(private prisma: PrismaService) {}
  
//     async promptQuestionsFromJSON(jsonFilePath: string): Promise<number> {
//         console.log("jsonFilePath: ", jsonFilePath);
//         try {
//             const questions = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
//             for (const question of questions) {
//                 const { text, options, isPreRegistration } = question;
//                 const createdQuestion = await this.prisma.question.create({
//                     data: {
//                         text,
//                         options: {
//                             create: options.map((option: any) => ({ text: option }))
//                         },
//                         isPreRegistration
//                     }
//                 });
  
//           console.log('Question created:', createdQuestion);
//         }
  
//         return HttpStatus.CREATED; // Return success code if data is added successfully
//       } catch (error) {
//         console.error('Error seeding questions:', error);
//         return HttpStatus.INTERNAL_SERVER_ERROR; // Return error code if something goes wrong
//       }
//     }}
//     // async getAllQuestions() {
//     //     return this.prisma.question.findMany({
//     //       include: {
//     //         options: true,
//     //       },
//     //     });
//     //   }
//     // }