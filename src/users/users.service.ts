import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CoachType, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: { firstName: string; lastName: string; email: string }): Promise<User> {
    try {
      
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        return existingUser;
      }

      return await this.prisma.user.create({
        data,
      });
    } catch (error) {
      console.error('Error in UsersService.createUser:', error);
      throw error;
    }
  }


async getUsers(): Promise<User[]> {
  return this.prisma.user.findMany();
}

async getUserById(id: number): Promise<User> {
  return this.prisma.user.findUnique({ where: { id } });
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
}