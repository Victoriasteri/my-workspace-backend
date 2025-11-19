import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({
    description: 'The title of the note',
    example: 'My First Note',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The content of the note',
    example: 'This is the content of my first note.',
  })
  @IsString()
  content: string;
}
