import { Controller, Post, Body, HttpException, HttpStatus, Delete, Get, Param, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger'; 
import { TranslationDto } from './translationDto.dto';

@ApiTags('User')

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post('createfromAPI')
  // async createUser(@Body() createUserDto: CreateUserDto) {
  //   try {
  //     const user = await this.usersService.createUser(createUserDto);
  //     return { user };
  //   } catch (error) {
  //     throw new HttpException({
  //       status: HttpStatus.INTERNAL_SERVER_ERROR,
  //       error: error.message || 'Could not create user',
  //     }, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }


  @ApiOperation({ summary: 'Get all users' })
  @Get("getAllUsers")
  async getUsers() {
    try {
      const users = await this.usersService.getUsers();
      return users;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Could not fetch users',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('getUserById/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'id', description: 'ID of the user', type: Number })
  async getUserById(@Param('id', ParseIntPipe) id: number) {
   
    try {
      const user = await this.usersService.getUserById(id);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('An internal server error occurred.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Post('addFavoriteCoachByName')
  async addFavoriteCoachByName(
    @Body() data: { userId: number; coachName: string }
  ) {
    const { userId, coachName } = data;
    try {
      await this.usersService.addFavoriteCoachByName(userId, coachName);
      return { message: 'Coach added successfully' };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Delete('removeFavoriteCoachByName')
  async removeFavoriteCoachByName(
    @Body() data: { userId: number; coachName: string }
  ) {
    const { userId, coachName } = data;
    try {
      await this.usersService.removeFavoriteCoachByName(userId, coachName);
      return { message: 'Coach removed successfully' };
    } catch (error) {
      return { error: error.message };
    }
  }
  @Delete('deleteUserById/:id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'id', description: 'ID of the user', type: Number })
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.usersService.deleteUserById(id);
      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error.message === 'User not found') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Post('translateandgetmsg')
  @ApiBody({ type: TranslationDto })
  @ApiResponse({ status: 200, description: 'Message traduit' })
  async handleTranslation(@Body() data: TranslationDto): Promise<string> {
    console.log(data);
    
    if (data.lang === 'AR') {
      console.log('Language is Arabic, proceeding with translation to English.');
      try {
        const translatedText = await this.usersService.translate(data.text, 'EN');
        console.log(`Translated text: ${translatedText}`);
        const openAIResponse = await this.usersService.getMsgFromAi(translatedText);
        const finalTranslatedText = await this.usersService.translate(openAIResponse, 'AR');
        console.log(`Final translated text: ${finalTranslatedText}`);
         return finalTranslatedText;
      } catch (error) {
        console.error(`Translation failed: ${error.message}`);
        return 'Failed to translate the message.';
      }
    } else {
      const openAIResponse = await this.usersService.getMsgFromAi(
        data.text
      );
      return openAIResponse;
    }
  }

  // @Delete()
  // async deleteOne(@Body() { id }: IdDto) {
  //   try {
  //     return this.usersService.deleteUser(id);
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
