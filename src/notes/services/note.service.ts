import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
    private storageService: StorageService,
    @InjectRepository(NoteAttachment)
    private noteAttachmentRepo: Repository<NoteAttachment>,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<NoteResponseDto> {
    const note = this.noteRepository.create({
      title: createNoteDto.title,
      content: createNoteDto.content,
    });
    const savedNote = await this.noteRepository.save(note);

    return this.toResponseDto(savedNote);
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

  // Get all notes
  async findAll(): Promise<NoteResponseDto[]> {
    const notes = await this.noteRepository.find({
      relations: ['attachments'],
    });
    return notes.map((note) => this.toResponseDto(note));
  }

  // Get a single note by ID
  async findOne(id: string): Promise<NoteResponseDto> {
    const note = await this.noteRepository.findOne({
      where: { id },
      relations: ['attachments'],
    });
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return this.toResponseDto(note);
  }

  // Internal method to get full Note entity (used by other methods)
  private async findOneEntity(id: string): Promise<Note> {
    const note = await this.noteRepository.findOne({
      where: { id },
      relations: ['attachments'],
    });
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  // Update a note
  async update(
    id: string,
    updateNoteDto: UpdateNoteDto,
  ): Promise<NoteResponseDto> {
    const note = await this.findOneEntity(id);

    if (updateNoteDto.title !== undefined) {
      note.title = updateNoteDto.title;
    }
    if (updateNoteDto.content !== undefined) {
      note.content = updateNoteDto.content;
    }

    // Set updatedAt when note is modified
    note.updatedAt = new Date();

    const updatedNote = await this.noteRepository.save(note);
    return this.toResponseDto(updatedNote);
  }

  // Delete a note
  async remove(id: string): Promise<void> {
    const result = await this.noteRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
  }

  //////////////////// attachments ////////////////

  async addAttachment(
    noteId: string,
    file: Express.Multer.File,
  ): Promise<NoteAttachmentResponseDto> {
    const currentNote = await this.findOneEntity(noteId);

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
  ): Promise<NoteAttachmentResponseDto[]> {
    // Verify note exists
    await this.findOneEntity(noteId);

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
