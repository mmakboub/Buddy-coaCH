import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class PromptService {
  constructor(private prisma: PrismaService) {}

  async addResponses(userId: number, questionsWithResponses: { question: string, response: string }[]): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { userResponses: true },
    });

    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    for (const { question, response } of questionsWithResponses) {
      let existingQuestion = await this.prisma.question.findFirst({
        where: { question }, 
      });

      if (!existingQuestion) {
        existingQuestion = await this.prisma.question.create({
          data: { question },
        });
      }
      const existingUserResponse = await this.prisma.userResponse.findFirst({
        where: {
          userId: userId,
          questionId: existingQuestion.id,
        },
      });

      if (existingUserResponse) {
        throw new Error(`User with id ${userId} has already responded to question: "${question}"`);
      }
      await this.prisma.userResponse.create({
        data: {
          response,
          user: { connect: { id: userId } },
          question: { connect: { id: existingQuestion.id } },
        },
      });
    }
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { userResponses: true },
    });
  }
}