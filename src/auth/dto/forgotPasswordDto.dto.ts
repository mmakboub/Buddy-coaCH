import { IsEmail, IsNotEmpty, IsString, Matches, IsDateString, IsISO31661Alpha2, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class forgotPasswordDto{
 
  @ApiProperty({ description: 'Email address of the user' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}