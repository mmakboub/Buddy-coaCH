import { IsInt, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsInt()
  userId: number;

  @IsInt()
  coachId: number;
}