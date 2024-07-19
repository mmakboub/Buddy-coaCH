import { Controller, Patch, Body, BadRequestException } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('profile')
@ApiTags('Profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Patch('updateFirstName')
  async updateFirstName(@Body() data: { id: number; firstName: string }) {
    if (!data.id) {
      throw new BadRequestException('User id is required');
    }
    if (!data.firstName) {
      throw new BadRequestException('First name is required');
    }
    if (data.firstName.length < 2 || data.firstName.length > 10) {
      throw new BadRequestException('First name should be between 2 and 10 characters');
    }
    if (data.firstName.match(/[^a-zA-Z]/)) {
      throw new BadRequestException('First name should contain only letters');
    }

    return await this.profileService.updateFirstName(data);
  }

  @Patch('updateLastName')
  async updateLastName(@Body() data: { id: number; lastName: string }) {
    if (!data.id) {
      throw new BadRequestException('User id is required');
    }
    if (!data.lastName) {
      throw new BadRequestException('Last name is required');
    }
    if (data.lastName.length < 2 || data.lastName.length > 10) {
      throw new BadRequestException('Last name should be between 2 and 10 characters');
    }
    if (data.lastName.match(/[^a-zA-Z]/)) {
      throw new BadRequestException('Last name should contain only letters');
    }

    return await this.profileService.updateLastName(data);
  }

  @Patch('updatePassword')
  async updatePassword(@Body() data: { id: number; password: string }) {
    if (!data.id) {
      throw new BadRequestException('User id is required');
    }
    if (!data.password) {
      throw new BadRequestException('Password is required');
    }
    if (data.password.length < 6) {
      throw new BadRequestException('Password should be at least 6 characters long');
    }

    return await this.profileService.updatePassword(data);
  }

  @Patch('updateEmail')
  async updateEmail(@Body() data: { id: number; email: string }) {
    if (!data.id) {
      throw new BadRequestException('User id is required');
    }
    if (!data.email) {
      throw new BadRequestException('Email is required');
    }
    if (!/\S+@\S+\.\S+/.test(data.email)) {
      throw new BadRequestException('Invalid email format');
    }

    return await this.profileService.updateEmail(data);
  }
}