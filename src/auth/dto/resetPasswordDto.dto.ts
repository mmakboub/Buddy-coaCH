import { IsNotEmpty, IsString, Length } from 'class-validator';

export class resetPasswordDto {
  @IsNotEmpty()
//   @Length(6, 6)
  email: string;

  @IsNotEmpty()
//   @IsString()
//   @Length(8, 20)
  password: string;

  @IsNotEmpty()
//   @IsString()
//   @Length(8, 20)
  confirmPassword: string;
}