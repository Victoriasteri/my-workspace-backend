import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Note } from './note.entity';

@Entity('notesAttachment')
export class NoteAttachment {
  @ApiProperty({
    description: 'The unique identifier of the attachment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Note, (note) => note.attachments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'noteId' })
  note: Note;

  @ApiProperty({
    description: 'The file path in storage',
    example: 'attachments/123e4567-e89b-12d3-a456-426614174000/file.pdf',
  })
  @Column()
  filePath: string;

  @ApiProperty({
    description: 'The original file name',
    example: 'document.pdf',
  })
  @Column()
  fileName: string;

  @ApiProperty({
    description: 'The MIME type of the file',
    example: 'application/pdf',
  })
  @Column()
  mimeType: string;

  @ApiProperty({
    description: 'The file size in bytes',
    example: 1024,
  })
  @Column()
  size: number;

  @ApiProperty({
    description: 'The public URL to access the file',
    example: 'https://example.com/storage/attachments/file.pdf',
  })
  @Column()
  url: string;

  @ApiProperty({
    description: 'The date when the attachment was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;
}
