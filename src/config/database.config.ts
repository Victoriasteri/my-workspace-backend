import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Note } from '../notes/entities/note.entity';
import { NoteAttachment } from '../notes/entities/note-attachment.entity';
import { Todo } from 'src/todos/entities/todo.entity';
import { TodoItem } from 'src/todos/entities/todo-item.entity';
import { User } from 'src/users/entities/user.entity';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const databaseUrl = configService.get<string>('DATABASE_URL');
  const connectionString = configService.get<string>('DB_NAME');

  return {
    type: 'postgres',
    url: databaseUrl || connectionString,
    entities: [Note, NoteAttachment, Todo, TodoItem, User],
    synchronize: configService.get<string>('NODE_ENV') !== 'production',
  };
};
