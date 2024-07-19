import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

 

export class TranslationDto {
  @IsString()
  @ApiProperty({ example: 'مرحبا', description: 'Text to be translated' })
  text: string;

  @IsString()
  @ApiProperty({ example: 'AR', description: 'Language code of the input text' })
  lang: string;

}