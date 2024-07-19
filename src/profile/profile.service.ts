import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async updateFirstName(data: { id: number; firstName: string }) {
    const existingUser = await this.prisma.user.findUnique({ where: { id: data.id } });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: data.id },
      data: { firstName: data.firstName },
    });

    return updatedUser;
  }

  async updateLastName(data: { id: number; lastName: string }) {
    const existingUser = await this.prisma.user.findUnique({ where: { id: data.id } });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: data.id },
      data: { lastName: data.lastName },
    });

    return updatedUser;
  }



  async updatePassword(data: { id: number; password: string }) {
    const existingUser = await this.prisma.user.findUnique({ where: { id: data.id } });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: data.id },
      data: { password: data.password },
    });

    return updatedUser;
  }

  async updateEmail(data: { id: number; email: string }) {
    const existingUser = await this.prisma.user.findUnique({ where: { id: data.id } });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: data.id },
      data: { email: data.email },
    });

    return updatedUser;
  }
}