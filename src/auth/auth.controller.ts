import { Body, Controller, Get, Post,Req,Res,UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/creatUser.dto';
import { AuthService } from './auth.service';
import { GoogleCallback, GoogleLogin, login, register } from './auth.decorators';
import { LoginDto } from './dto/login.dto';
import { GoogleOauthGuard} from './guards/google-Oauth.guard';
// import { GoogleGuard } from './google.guard';
// import {  GoogleLoginDoc } from './auth.decorators';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { REDIRECT_METADATA } from '@nestjs/common/constants';
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
    async login(@Body() LoginDto: LoginDto) {
        return this.authService.login(LoginDto);
    }
 
    @Get('google')
    @UseGuards(GoogleOauthGuard)
    @GoogleLogin()
    async googleAuth(@Req() req) {}
  
    @Get('google/callback')
    @GoogleCallback()
    @UseGuards(GoogleOauthGuard)
    async googleAuthRedirect(@Req() req, @Res() res) {
      await this.authService.callback(req, res);
    }
    @Get('apple')
    async appleAuth(@Req() req) {
    }
    @Get('apple/callback')
    async appleAuthRedirect(@Req() req, @Res() res) {
        await this.authService.callback(req, res);
    }

}
