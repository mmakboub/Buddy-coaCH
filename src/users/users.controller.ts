import { Controller, Post, Body, HttpException, HttpStatus, Delete, Get, Param, NotFoundException, ParseIntPipe, UseGuards, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger'; 
import { TranslationDto } from './translationDto.dto';
import { AuthGuard} from '@nestjs/passport';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { verify } from 'crypto';
import * as jwt from 'jsonwebtoken';
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
  @Get('getFavoriteCoachesByUserIdfromtoken')
  async getFavoriteCoachesByUserIdfromtoken(@Req() req, @Res() res: Response) {
    if (!req.headers.authorization) {
      throw new HttpException('Authorization header not found', HttpStatus.UNAUTHORIZED);
    }
    const token = req.headers.authorization.split(' ')[1];
    console.log("token" , token)
    const decodedToken = await this.verifyToken(token);
    console.log("decodedToken:", decodedToken);
    const userId = decodedToken.sub; 
    try {
      const favoriteCoaches = await this.usersService.getFavoriteCoachesByUserId(userId);
      console.log("fav:", favoriteCoaches);
      if (!favoriteCoaches) {
        return res.status(HttpStatus.OK).json({ message: 'No favorite coaches found' });
      }
      return res.status(HttpStatus.OK).json(favoriteCoaches);
    } 
    catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
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

  @Delete('haspassword')
@ApiOperation({ summary: 'Check if user has a password' })
@ApiResponse({ status: 204, description: 'User has password.' })
@ApiResponse({ status: 200, description: 'User has no password.' })
@ApiResponse({ status: 404, description: 'User not found.' })
@ApiResponse({ status: 400, description: 'Bad request.' })
@ApiParam({ name: 'id', description: 'ID of the user', type: Number })
async hasPassword(@Req() req, @Res() res: Response) {
  try {

    console.log("req.headers.authorization",req.headers.authorization);
    const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header
    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Authorization token is missing',
      });
    }

    const decodedToken = await this.verifyToken(token); // Assuming you have a verifyToken method
    const id = decodedToken.sub; // Extract user ID from the decoded token

    if (!id) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User id is required',
      });
    }

    const user = await this.usersService.getUserById(id);
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    if (user.password) {
      return res.status(HttpStatus.NO_CONTENT).json({
        statusCode: HttpStatus.NO_CONTENT,
        message: 'User has password',
      });
    } else {
      await this.usersService.deleteUserById(id);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'User has no password',
      });
    }
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
}

@Delete('deleteUserById')
@ApiOperation({ summary: 'Delete user by ID with password confirmation' })
@ApiResponse({ status: 200, description: 'User deleted successfully.' })
@ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token.' })
@ApiResponse({ status: 404, description: 'User not found.' })
@ApiResponse({ status: 400, description: 'Bad request - Invalid password.' })
async deleteUserById(@Req() req, @Res() res: Response, @Body() data: { password: string }) {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract the token
    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Authorization token is missing',
      });
    }

    const decodedToken = await this.verifyToken(token); // Assuming verifyToken decodes the token
    const userId = decodedToken.sub; // Extract user ID from decoded token

    if (!userId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User ID is required',
      });
    }

    // Fetch the user by ID
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    // Validate the provided password with the stored password
    const isPasswordValid = await this.usersService.validatePassword(data.password, user.password); // Assuming validatePassword checks password

    if (!isPasswordValid) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid password',
      });
    }

    // If password is valid, delete the user
    await this.usersService.deleteUserById(userId);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully',
    });

  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
}

  async verifyToken(token: string): Promise<any> {
    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
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
