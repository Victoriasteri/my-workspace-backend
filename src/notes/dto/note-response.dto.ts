import { ApiProperty } from '@nestjs/swagger';

export class NoteResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the note',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The title of the note',
    example: 'My First Note',
  })
  title: string;

  @ApiProperty({
    description: 'The content of the note',
    example: 'This is the content of my note',
  })
  content: string;

  @ApiProperty({
    description: 'The date when the note was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the note was last updated',
    example: '2024-01-01T00:00:00.000Z',
    nullable: true,
  })
  updatedAt: Date | null;

  @ApiProperty({
    description: 'Array of attachment IDs associated with this note',
    type: [String],
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '223e4567-e89b-12d3-a456-426614174001',
    ],
  })
  attachmentIds: string[];
}
