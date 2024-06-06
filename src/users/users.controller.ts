import { Controller, Post, Body, HttpException, HttpStatus, Delete } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async createUser(@Body() body: { firstName: string, lastName: string, email: string }) {
    try {
      const user = await this.usersService.createUser(body);
      return {user };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Could not create user',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
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
}
