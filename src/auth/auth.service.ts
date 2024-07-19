import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/creatUser.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  
 
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  
  async login(loginUserDto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: loginUserDto.email },
      });
      if (!user) {
        throw new Error('User not found');
      }
      const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
      const payload = { email: user.email, sub: user.id };
      const access_token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d',
      });
      return { access_token, user };
    } catch (error) {
        throw new UnauthorizedException('Login failed');
    }
  }

  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.createUser({
        firstName: createUserDto.firstName, 
        lastName: createUserDto.lastName,
        email: createUserDto.email,
        birthDate: createUserDto.birthDate,
        pays: createUserDto.pays,
        password: await bcrypt.hash(createUserDto.password, 10),
      });
      return this.login({ email: createUserDto.email, password: createUserDto.password });
    } catch (error) {
      throw error;
    }
  }
  async callback(req, res) {
    try {
      if (!req.user) {
        res.redirect(process.env.FRONTEND_URL);
        res.end();
      }
      const data = req.user;
      let user: User = await this.usersService.findUserByEmail(data.login);
      if (!user) {
        user = await this.usersService.createUser({
          firstName: data.firstName, 
          lastName: data.lastName,
          email: data.email,
          birthDate: data.birthDate,
          pays: data.pays,
        });
      }


      const payload = {  sub: user.id, email: user.email };
      const access_token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d',
      });
      res.cookie('access_token', access_token);
      // if (Math.abs(user.createdAt.getTime() - user.updatedAt.getTime()) <= 1500)
      //   res.cookie('complete_info', 'complete_your_info');
      // res.redirect(process.env.FRONTEND_URL);
      res.end();
      return;
    } catch (error: any) {
      throw new InternalServerErrorException(error.response.message);
    }
  }
}
