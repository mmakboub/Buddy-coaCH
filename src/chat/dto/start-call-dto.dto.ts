import { IsDateString, IsEnum, IsInt, IsString } from 'class-validator';
import { CallType } from '@prisma/client';

export class startCallDto {
  @IsInt()
  userId: number;

  @IsInt()
  coachId: number;

  @IsString()
  startedAt: string;

  @IsEnum(CallType)
  callType: CallType;
}