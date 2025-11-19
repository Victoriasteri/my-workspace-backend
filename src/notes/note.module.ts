import { BadRequestException, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { NoteAttachment } from './entities/note-attachment.entity';
import { NoteController } from './controllers/note.controller';
import { NoteService } from './services/note.service';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ALLOWED_NOTES_FILE_TYPES } from 'consts';
import { StorageModule } from '../shared/storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note, NoteAttachment]),
    MulterModule.register({
      storage: memoryStorage(),
      limits: {
        fileSize: 15 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        if (!ALLOWED_NOTES_FILE_TYPES.includes(file.mimetype)) {
          return cb(new BadRequestException('invalid file type'), false);
        }
        cb(null, true);
      },
    }),
    StorageModule,
  ],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
