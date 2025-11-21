import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { NoteAttachment } from './note-attachment.entity';

@Entity('notes')
export class Note {
  @ApiProperty({
    description: 'The unique identifier of the note',
    example: '1',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The title of the note',
    example: 'My First Note',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'The content of the note',
    example: 'This is the content of my note',
  })
  @Column('text')
  content: string;

  @ApiProperty({
    description: 'The date when the note was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the note was last updated',
    example: '2024-01-01T00:00:00.000Z',
    nullable: true,
  })
  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null;

  @ApiProperty({
    description: 'The attachments associated with this note',
    type: () => [NoteAttachment],
    isArray: true,
  })
  @OneToMany(() => NoteAttachment, (attachment) => attachment.note)
  attachments: NoteAttachment[];

  @ApiProperty({
    description: 'The ID of the user who owns this note',
    example: 'user-uuid-here',
  })
  @Column('uuid')
  userId: string;
}
