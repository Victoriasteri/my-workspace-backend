import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteModule } from './notes/note.module';
import { getDatabaseConfig } from './config/database.config';
import { SupabaseModule } from './shared/supabase/supabase.module';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    NoteModule,
    SupabaseModule,
    TodosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
