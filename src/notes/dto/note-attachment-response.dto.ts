import { ApiProperty } from '@nestjs/swagger';

export class NoteAttachmentResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the attachment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The id of the related note',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  noteId: string;

  @ApiProperty({
    description: 'The file path in storage',
    example: 'attachments/123e4567-e89b-12d3-a456-426614174000/file.pdf',
  })
  filePath: string;

  @ApiProperty({
    description: 'The original file name',
    example: 'document.pdf',
  })
  fileName: string;

  @ApiProperty({
    description: 'The MIME type of the file',
    example: 'application/pdf',
  })
  mimeType: string;

  @ApiProperty({
    description: 'The file size in bytes',
    example: 1024,
  })
  size: number;

  @ApiProperty({
    description: 'The public URL to access the file',
    example: 'https://example.com/storage/attachments/file.pdf',
  })
  url: string;

  @ApiProperty({
    description: 'The date when the attachment was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}
