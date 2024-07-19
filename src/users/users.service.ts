import { ConflictException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CoachType, User } from '@prisma/client';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

@Injectable()
export class UsersService {
 
  constructor(private prisma: PrismaService,
    private httpService: HttpService
  ) {}


async getUsers(): Promise<User[]> {
  return this.prisma.user.findMany();
}

async getUserById(id: number): Promise<User> {
  try {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new Error(`Failed to fetch user with ID ${id}: ${error.message}`);
  }
}
async getFavoriteCoachesByUserId(userId: number) {
  return this.prisma.user.findUnique({
    where: { id: userId },
    select: { favoriteCoaches: true },
  });
 }

async addFavoriteCoachByName(userId: number, coachName: string) {
  const coachTypes = {
    kensa: CoachType.PARENTAL,
    mehdi: CoachType.SPORT,
    zina: CoachType.STUDY
  };

  const coachType = coachTypes[coachName.toLowerCase()];
  const existingUser = await this.prisma.user.findUnique({
    where: { id: userId},
  });
  if(!existingUser) throw new Error('Invalid user id');
  
  if (!coachType) {
    throw new Error(`Invalid coach name: ${coachName}`);
  }

  let coach = await this.prisma.coach.findUnique({
    where: { name: coachName },
  });

  if (!coach) {
    coach = await this.prisma.coach.create({
      data: {
        name: coachName,
        type: coachType,
      },
    });
  }

  return this.prisma.user.update({
    where: { id: userId },
    data: {
      favoriteCoaches: {
        connect: { id: coach.id },
      },
    },
  });
}

async removeFavoriteCoachByName(userId: number, coachName: string) {
  const existingUser = await this.prisma.user.findUnique({
    where: { id: userId},
  });
  if(!existingUser) throw new Error('Invalid user id');
  const coach = await this.prisma.coach.findUnique({
    where: { name: coachName },
  });

  if (!coach) {
    throw new Error(`Coach with name ${coachName} does not exist`);
  }

  return this.prisma.user.update({
    where: { id: userId },
    data: {
      favoriteCoaches: {
        disconnect: { id: coach.id },
      },
    },
  });
}
async findOrCreateUser(data: {
  firstname: string;
 lastname: string;
 email: string;
 birthDate: string;
  pays: string;
}) {
  try {
    let user: User = await this.findUserByEmail(data.email);
    if (!user) {
      user = await this.createUser({
        firstName: data.firstname, 
        lastName: data.lastname,
        email: data.email,
        birthDate: data.birthDate,
        pays: data.pays,
      });
    }
    return user;
  } catch (error) {
    throw new InternalServerErrorException();
  }
}
async createUser(data: { firstName: string; lastName: string; email: string; birthDate: string; pays: string; password?:string }): Promise<User> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new ConflictException('Email is already in use');
      }
      const user = await this.prisma.user.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          birthDate: data.birthDate,
          pays: data.pays,
          password: data.password,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
  // async updateUserById(id: number, data: { firstName?: string; lastName?: string; email?: string; numberPhone?: string; birthDate?: string; pays?: string; password?: string }): Promise<User> {
  //   try {
  //     const user = await this.prisma.user.findUnique({ where: { id } });
  //     if (!user) {
  //       throw new NotFoundException(`User with ID ${id} not found`);
  //     }
  //     return await this.prisma.user.update({
  //       where: { id },
  //       data,
  //     });
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     throw new Error(`Failed to update user with ID ${id}: ${error.message
  //     }`);
  //   }
  // }

async findUserByEmail(email: string) {
  try {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    throw new NotFoundException(`user with ${email} does not exist.`);
  }
}
async deleteUserById(id: number) {
  try {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    await this.prisma.user.delete({ where: { id } });
  } catch (error) {
    throw new Error(`Failed to delete user with ID ${id}: ${error.message}`);
  }
}
async translate(text: string, targetLang: string): Promise<string> {
  try {
    console.log(`Translating text: ${text} to language: ${targetLang}`);

    const response: AxiosResponse = await this.httpService.post(
      'https://api-free.deepl.com/v2/translate',
      {
        text: [text],
        target_lang: targetLang,
      },
      {
        headers: {
          'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    ).toPromise();

    console.log(`Translation response: ${JSON.stringify(response.data)}`);
    return response.data.translations[0].text;
  } catch (error) {
    console.error(`Translation error: ${error.message}`);
    throw error;
  }
}
async getMsgFromAi(message: string): Promise<string> {
  console.log(`Getting message from AI for prompt: ${message}`);
  try {
    const response: AxiosResponse = await this.httpService.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        messages: [
          { role: 'system', content: 'You are coach fitness' },
          { role: 'user', content: message }
        ],
        model: 'llama3-8b-8192',
        max_tokens: 50
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 
          'Content-Type': 'application/json',
        },
      },
    ).toPromise();

    console.log(`AI response: ${JSON.stringify(response.data)}`);
    return response.data.choices[0].message.content;;
  } catch (error) {
    console.error(`AI request error: ${error.response?.data || error.message}`);
    throw error;
  }
}
}