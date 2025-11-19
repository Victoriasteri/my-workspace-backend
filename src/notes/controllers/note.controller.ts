import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { NoteResponseDto } from '../dto/note-response.dto';
import { NoteAttachment } from '../entities/note-attachment.entity';
import { NoteService } from '../services/note.service';
import { NoteAttachmentResponseDto } from '../dto/note-attachment-response.dto';

@ApiTags('notes')
@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({
    status: 201,
    description: 'The note has been successfully created.',
    type: NoteResponseDto,
  })
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  async create(@Body() createNoteDto: CreateNoteDto): Promise<NoteResponseDto> {
    return await this.noteService.create(createNoteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notes' })
  @ApiResponse({
    status: 200,
    description: 'Return all notes.',
    type: [NoteResponseDto],
  })
  async findAll(): Promise<NoteResponseDto[]> {
    return await this.noteService.findAll();
  }

  // -------------// GET by ID //---------- //

  @Get(':id')
  @ApiOperation({ summary: 'Get a note by ID' })
  @ApiParam({ name: 'id', description: 'Note ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the note.',
    type: NoteResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  async findOne(@Param('id') id: string): Promise<NoteResponseDto> {
    return await this.noteService.findOne(id);
  }

  //--------// UPDATE //--------//

  @Put(':id')
  @ApiOperation({ summary: 'Update a note' })
  @ApiParam({ name: 'id', description: 'Note ID' })
  @ApiResponse({
    status: 200,
    description: 'The note has been successfully updated.',
    type: NoteResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<NoteResponseDto> {
    return await this.noteService.update(id, updateNoteDto);
  }

  //--------// DELETE //--------//

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a note' })
  @ApiParam({ name: 'id', description: 'Note ID' })
  @ApiResponse({
    status: 204,
    description: 'The note has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.noteService.remove(id);
  }

  //---------------------------// ATTACHMENTS //--------//

  //--------// UPLOAD //--------//

  @Post(':id/attachments')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload an attachment to a note' })
  @ApiParam({ name: 'id', description: 'Note ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The file to upload',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The attachment has been successfully uploaded.',
    type: NoteAttachment,
  })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  uploadAttachment(
    @Param('id') noteId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<NoteAttachmentResponseDto> {
    return this.noteService.addAttachment(noteId, file);
  }

  //--------// GET ALL ATTACHMENTS OF THE NOTE //--------//
  @Get(':id/attachments')
  @ApiOperation({ summary: 'Get all attachments by the note ID' })
  @ApiParam({ name: 'id', description: 'Note ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the list of attachment.',
    type: Array<NoteAttachment>,
  })
  @ApiResponse({ status: 404, description: 'Attachments not found' })
  async findAllAttachmentsOfTheNote(
    @Param('id') id: string,
  ): Promise<NoteAttachmentResponseDto[]> {
    return await this.noteService.getAllAttachments(id);
  }

  //--------// REMOVE AN ATTACHMENT OF THE NOTE //--------//
  @Delete('attachments/:attachmentId')
  @ApiOperation({ summary: 'Delete an attachment of the note' })
  @ApiParam({ name: 'attachmentId', description: 'Attachment ID' })
  async deleteNoteAttachment(@Param('attachmentId') attachmentId: string) {
    return await this.noteService.deleteAttachment(attachmentId);
  }
}
