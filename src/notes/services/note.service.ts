import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { NoteResponseDto } from '../dto/note-response.dto';
import { Note } from '../entities/note.entity';
import { Repository } from 'typeorm';
import { StorageService } from '../../services/storage/storage.service';
import { NoteAttachment } from '../entities/note-attachment.entity';
import { NoteAttachmentResponseDto } from '../dto/note-attachment-response.dto';
import { UserOwnedService } from '../../shared/srvices/owned-by-user.service';

@Injectable()
export class NoteService extends UserOwnedService<Note> {
  constructor(
    @InjectRepository(Note)
    noteRepository: Repository<Note>,
    private storageService: StorageService,
    @InjectRepository(NoteAttachment)
    private noteAttachmentRepo: Repository<NoteAttachment>,
  ) {
    super(noteRepository);
  }

  async create(
    userId: string,
    createNoteDto: CreateNoteDto,
  ): Promise<NoteResponseDto> {
    const savedNote = await this.createForUser(userId, {
      title: createNoteDto.title,
      content: createNoteDto.content,
    } as Omit<Note, 'id' | 'userId'>);

    const noteWithRelations = await this.repo.findOne({
      where: { id: savedNote.id },
      relations: ['attachments'],
    });

    return this.toResponseDto(noteWithRelations || savedNote);
  }

  // Helper method to transform Note to NoteResponseDto
  private toResponseDto(note: Note): NoteResponseDto {
    return {
      id: note.id,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      attachmentIds: note.attachments?.map((attachment) => attachment.id) || [],
    };
  }

  // Get all notes for a user
  async findAll(userId: string): Promise<NoteResponseDto[]> {
    const notes = await this.findAllForUser(userId, {
      attachments: true,
    });
    return notes.map((note) => this.toResponseDto(note));
  }

  // Get a single note by ID for a user
  async findOne(id: string, userId: string): Promise<NoteResponseDto> {
    const note = await this.findOneEntity(id, userId);
    return this.toResponseDto(note);
  }

  // Internal method to get full Note entity (used by other methods)
  private async findOneEntity(id: string, userId: string): Promise<Note> {
    const note = await this.findOneForUser(id, userId, { attachments: true });
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  // Update a note
  async update(
    id: string,
    userId: string,
    updateNoteDto: UpdateNoteDto,
  ): Promise<NoteResponseDto> {
    const updateData: Partial<Omit<Note, 'id' | 'userId'>> = {
      ...updateNoteDto,
      updatedAt: new Date(),
    };

    await this.updateForUser(id, userId, updateData);
    const updatedNote = await this.findOneEntity(id, userId);
    return this.toResponseDto(updatedNote);
  }

  // Delete a note
  async remove(id: string, userId: string): Promise<void> {
    await this.deleteForUser(id, userId);
  }

  //////////////////// attachments ////////////////

  async addAttachment(
    noteId: string,
    userId: string,
    file: Express.Multer.File,
  ): Promise<NoteAttachmentResponseDto> {
    const currentNote = await this.findOneEntity(noteId, userId);

    const supabaseResponse = await this.storageService.uploadFile(file);

    const attachmentData: Partial<NoteAttachment> = {
      filePath: supabaseResponse.filePath,
      fileName: supabaseResponse.fileName,
      size: supabaseResponse.size,
      mimeType: supabaseResponse.mimeType,
      url: supabaseResponse.publicUrl,
      note: currentNote,
    };

    const newAttachment = this.noteAttachmentRepo.create(attachmentData);

    const createdAttachment = await this.noteAttachmentRepo.save(newAttachment);

    const attachmentToReturn: NoteAttachmentResponseDto = {
      id: createdAttachment.id,
      noteId: createdAttachment.note.id,
      fileName: createdAttachment.fileName,
      filePath: createdAttachment.filePath,
      mimeType: createdAttachment.mimeType,
      url: createdAttachment.url,
      size: createdAttachment.size,
      createdAt: createdAttachment.createdAt,
    };

    return attachmentToReturn;
  }

  async deleteAttachment(attachmentId: string) {
    const currentAttachment =
      await this.noteAttachmentRepo.delete(attachmentId);
  }

  async getAllAttachments(
    noteId: string,
    userId: string,
  ): Promise<NoteAttachmentResponseDto[]> {
    // Verify note exists and belongs to user
    await this.findOneEntity(noteId, userId);

    // Get all attachments for this note
    const attachments = await this.noteAttachmentRepo.find({
      where: { note: { id: noteId } },
      relations: ['note'],
    });

    if (!attachments || attachments.length === 0)
      throw new BadRequestException('unable to retrieve the attachments');

    const attachmentsToReturn: NoteAttachmentResponseDto[] = attachments.map(
      (att) => {
        return {
          id: att.id,
          noteId: att.note.id,
          fileName: att.fileName,
          filePath: att.filePath,
          mimeType: att.mimeType,
          size: att.size,
          url: att.url,
          createdAt: att.createdAt,
        };
      },
    );

    return attachmentsToReturn;
  }
}
