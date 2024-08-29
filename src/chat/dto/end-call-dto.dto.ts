import { IsDateString, IsEnum, IsInt, IsString } from 'class-validator';
import { CallType } from '@prisma/client';

export class endCallDto {
  @IsInt()
  CallId: number;

  @IsString()
  endedAt: string;
}