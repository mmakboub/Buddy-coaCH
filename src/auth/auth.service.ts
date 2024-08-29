import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/creatUser.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { forgotPasswordDto } from './dto/forgotPasswordDto.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { resetPasswordDto } from './dto/resetPasswordDto.dto';

@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}
  
  
  async login(loginUserDto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: loginUserDto.email },
      });
      console.log(user)
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
      console.log(access_token)
      return { access_token, user };
    } catch (error) {
        throw new UnauthorizedException('Login failed');
    }
  }
  // async getUserFromToken(token: string) {
  //   try {
  //     const decoded = await this.jwtService.verifyAsync(token, {
  //       secret: process.env.JWT_SECRET,
  //     });

  //     const user = await this.prisma.user.findUnique({ where: { id: decoded.sub } });

  //     if (!user) {
  //       throw new UnauthorizedException('User not found');
  //     }

  //     const { password, ...result } = user; 
  //     return result;
  //   } catch (error) {
  //     throw new UnauthorizedException('Invalid token');
  //   }
  // }
  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.createUser({
        firstName: createUserDto.firstName, 
        lastName: createUserDto.lastName,
        email: createUserDto.email,
        birthDate: createUserDto.birthDate,
        pays: createUserDto.pays,
        password: await bcrypt.hash(createUserDto.password, 10),
        cnxtype : createUserDto.cnxtype,
        language:'en',
        pictureUrl:'https://res.cloudinary.com/dafjoc7f3/image/upload/v1724936595/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD_yqevgh.jpg'
      });
      return this.login({ email: createUserDto.email, password: createUserDto.password });
    } catch (error) {
      throw error;
    }
  }
 

  async forgotPassword(forgotPasswordDto: forgotPasswordDto) {
   try {
    const user = await this.prisma.user.findUnique({
      where: { email: forgotPasswordDto.email },
    });
    if (!user) {
      throw new Error('User with this email doesn\'t exist');
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 30);

    await this.prisma.user.update({
      where: { email: forgotPasswordDto.email },
      data: {
        otp,
        otpExpiry,
      },
    });

    await this.mailerService.sendMail({
      to: forgotPasswordDto.email,
      subject: 'Password reset OTP',
      text: `Your OTP (It expires in 15 minute): ${otp}`,
    });

    return { otp }; 
    } catch (error) {
      throw new InternalServerErrorException(error.message)
   }
}
async resetPassword(resetPasswordDto: resetPasswordDto) {
  const { email, password, confirmPassword } = resetPasswordDto;
  console.log(email, password, confirmPassword);
  if (password !== confirmPassword) {
    console.log('Passwords do not match');
    throw new BadRequestException('Passwords do not match');
  }

  const user = await this.prisma.user.findFirst({
    where: {
      email,
      otpExpiry: {
        gt: new Date(),
      },
    },
  });
  console.log(user);

  if (!user) {
    console.log('Invalid or expired OTP');
    throw new BadRequestException('Invalid or expired OTP');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
console.log(hashedPassword);
  await this.prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      otp: null,
      otpExpiry: null,
    },
  });
  console.log('Password reset successful');
  return { message: 'Password reset successful' };
}
}
