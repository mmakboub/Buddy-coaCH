import { Controller, Patch, Body, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiTags } from '@nestjs/swagger';
import { use } from 'passport';
import { UsersService } from 'src/users/users.service';

@Controller('profile')
@ApiTags('Profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService,
    private readonly userService: UsersService
  ) {}
  @Patch('updateprofile')
  async updateProfile(@Body() data: { id: number; name?: string; email?: string; password?: string,token:string,pictureUrl?:string }) {
    console.log("data",data);
    if (!data.id) {
      throw new BadRequestException('User id is required');
    }
  
    const updates = [];
  
    if (data.name) {
      console.log("data.firstName",data.name);
      updates.push(this.profileService.updateFirstName({ id: data.id, firstName: data.name }));
    }
    if(data.pictureUrl){  
      updates.push(this.profileService.updatePictureUrl({ id: data.id, pictureUrl: data.pictureUrl }));
    }
    
    if (data.email) {
      updates.push(this.profileService.updateEmail({ id: data.id, email: data.email }));
    }
    if (data.password) {
      updates.push(this.profileService.updatePassword({ id: data.id, password: data.password }));
    }
  
    if (updates.length === 0) {
      throw new BadRequestException('At least one field (firstName, email, password) must be provided');
    }
  
    try {
      await Promise.all(updates);
      const updatedUser = await this.userService.getUserById(data.id);

      console.log("Returning tokens:", data.token);
    return { user: updatedUser, token: data.token };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update profile');
    }
  }
  @Patch('updatelanguage')
  async updatelanguage(@Body() data: { id: number; language: string }) {
    if (!data.id) {
      throw new BadRequestException('User id is required');
    }
    if (!data.language) {
      throw new BadRequestException('language is required');
    }
    // if (!data.language.match(/^(en|fr|es)$/)) {
    //   throw new BadRequestException('Invalid language');
    // }

    return await this.profileService.updatelanguage(data);
  }
}