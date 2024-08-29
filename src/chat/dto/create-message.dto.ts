import { IsString, IsInt, IsOptional, IsEnum, isIn, isInt, IsDateString } from 'class-validator';
import { MsgType, Sender } from '@prisma/client';

export class CreateMessageDto {
  @IsOptional()
  @IsString()
  msg?: string;

  @IsEnum(MsgType)
  msgType: MsgType;

  @IsInt()
  userId: number;

  @IsInt()
  coachId: number;

  @IsEnum(Sender)
  sender: Sender;

  @IsString()
  roomId: string;

  @IsDateString()
  time: string;
}