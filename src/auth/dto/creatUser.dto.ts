import { IsEmail, IsNotEmpty, IsString, Matches, IsDateString, IsISO31661Alpha2, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'First name of the user' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name of the user' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

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

  // @ApiProperty({ description: 'Phone number of the user, between 10 and 15 digits' })
  // @IsNotEmpty()
  // @IsString()
  // @Matches(/^[0-9]{10,15}$/, {
  //   message: 'Phone number must be between 10 and 15 digits long'
  // })
  // numberPhone: string;

  @ApiProperty({ description: 'Birth date of the user in ISO 8601 format' })
  @IsNotEmpty()
  // @IsDateString()
  birthDate: string;

  @ApiProperty({ description: 'Country code of the user in ISO 3166-1 alpha-2 format' })
  @IsNotEmpty()
  @IsString()
  // @IsISO31661Alpha2()
  pays: string;
}