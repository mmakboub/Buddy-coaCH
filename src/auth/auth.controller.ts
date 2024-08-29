import { Body, Controller, Get, HttpException, HttpStatus, InternalServerErrorException, Post,Req,Res,UnauthorizedException,UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/creatUser.dto';
import { AuthService } from './auth.service';
import { forgotPassword, login, logout, register, resetPassword } from './auth.decorators';
import { LoginDto } from './dto/login.dto';
import { forgotPasswordDto } from './dto/forgotPasswordDto.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { resetPasswordDto } from './dto/resetPasswordDto.dto';
import { Request, Response } from 'express';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @register()
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @login()
    @Post('login')
    async login(@Body() LoginDto: LoginDto, @Res() res) {
      const { access_token, user } = await this.authService.login(LoginDto);
    res.cookie('token', access_token, {
      httpOnly: true, 
    });

    return res.send({ user, token: access_token });
        
    }

    // @Get('validate-token')
    // async user(@Req() request: Request) {
    //   try {
        
    //     return this.authService.getUserFromToken(request.cookies['token']);
    //   } catch (e) {
    //     throw new UnauthorizedException();
    //   }
    // }

    @forgotPassword()
    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: forgotPasswordDto) {

        try {
            return this.authService.forgotPassword(forgotPasswordDto);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: error.message || 'Could not send OTP to email',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
@resetPassword()
    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: resetPasswordDto) {
      try{
        console.log("resetPasswordDto",resetPasswordDto)
        return this.authService.resetPassword(resetPasswordDto);
      }
      catch (error) {
        throw new HttpException({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: error.message || 'Could not reset password',
        }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


 

  // @logout()
@Get('logout')
async logout(@Res() res) {
  res.clearCookie('token');
  return res.status(HttpStatus.OK).json({ message: 'Logout successful' });
}
}
    // @Get('google')
    // @UseGuards(GoogleOauthGuard)
    // @GoogleLogin()
    // async googleAuth(@Req() req) {
    //     console.log("googleAuth");
    // }

    // @Get('google/callback')  
    // @UseGuards(GoogleOauthGuard)
    // @GoogleCallback()
    // async googleAuthRedirect(@Req() req, @Res() res) {
    //   console.log("googleAuthRedirect");
    //   await this.authService.callback(req, res);
    // }
    // @Post('api')
    // async googleLogin(@Body() body) {
    //   const { idToken } = body;
    //   console.log("iD:", idToken)
    //   return (idToken)
    // }
  
    
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
    // @Get('instagram')
    // @UseGuards(instaOauthGuard)
    // async instaAuth(@Req() req) {
    //     console.log("appleAuth");
    // }
  