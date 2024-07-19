import { IsEmail, IsNotEmpty, IsString, Matches, IsDateString, IsISO31661Alpha2, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
 
  @ApiProperty({ description: 'Email address of the user' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password for the user account' })
  @IsNotEmpty()
  @IsString()
  // @IsStrongPassword({
  //   minLength: 8,
  //   minLowercase: 1,
  //   minUppercase: 1,
  //   minNumbers: 1,
  //   minSymbols: 1,
  // })
  password: string;
}