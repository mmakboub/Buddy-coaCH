import { IsString, IsInt, IsOptional, IsEnum, isIn, isInt } from 'class-validator';
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

  @IsString()
  time: string;
}