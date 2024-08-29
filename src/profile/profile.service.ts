import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}
  async updatelanguage(data: { id: number; language: string; }) {
    const existingUser = await this.prisma.user.findUnique({ where: { id: data.id } });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.prisma.user.update({
      where: { id: data.id },
      data: { language: data.language },
    });
    return updatedUser;
  }


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
  
  async updatePassword(data: { id: number; password: string }) {
    const existingUser = await this.prisma.user.findUnique({ where: { id: data.id } });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
  
    const hashedPassword = await bcrypt.hash(data.password, 10);
  
    const updatedUser = await this.prisma.user.update({
      where: { id: data.id },
      data: { password: hashedPassword }, // Use hashedPassword here
    });
  
    return updatedUser; // Optionally return the updated user
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
  async updatePictureUrl(data: { id: number; pictureUrl: string }) {
    const existingUser = await this.prisma.user.findUnique({ where: { id: data.id } });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.prisma.user.update({
      where: { id: data.id },
      data: { pictureUrl: data.pictureUrl },
    });
  
    return updatedUser;
  }
}