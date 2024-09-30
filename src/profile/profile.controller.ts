import { Controller, Patch, Body, BadRequestException, InternalServerErrorException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChatService } from 'src/chat/chat.service';

@Controller('profile')
@ApiTags('Profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService,
    private readonly chatService: ChatService,
    private readonly userService: UsersService
  ) {}
  @Patch('updateprofile')
@UseInterceptors(FileInterceptor('file'))
async updateProfile(
  @Body('data') data: string,  // Get 'data' as a string
  @UploadedFile() file: Express.Multer.File | null,
) {
  const parsedData = JSON.parse(data);  // Parse the JSON string
  const id = Number(parsedData.id);

  const updates = [];

  if (file) {
    try {
      const uploadedFile = await this.chatService.uploadFile(file);
      const fileUrl = uploadedFile.url;
      updates.push(this.profileService.updatePictureUrl({ id, pictureUrl: fileUrl }));
    } catch (uploadError) {
      throw new InternalServerErrorException('File upload failed');
    }
  }

  if (parsedData.email) {
    updates.push(this.profileService.updateEmail({ id, email: parsedData.email }));
  }

  if (parsedData.password) {
    updates.push(this.profileService.updatePassword({ id, password: parsedData.password }));
  }

  if (updates.length === 0) {
    throw new BadRequestException('At least one field (name, email, password) must be provided');
  }

  try {
    await Promise.all(updates);
    const updatedUser = await this.userService.getUserById(id);
    return { user: updatedUser, token: parsedData.token };
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