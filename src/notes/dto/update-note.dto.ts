import { ApiProperty } from '@nestjs/swagger';

export class UpdateNoteDto {
  @ApiProperty({
    description: 'The title of the note',
    example: 'Updated Note Title',
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: 'The content of the note',
    example: 'Updated note content',
    required: false,
  })
  content?: string;
}
