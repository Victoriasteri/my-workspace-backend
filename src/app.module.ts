import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteModule } from './notes/note.module';
import { getDatabaseConfig } from './config/database.config';
import { SupabaseModule } from './shared/supabase/supabase.module';
import { TodosModule } from './todos/todos.module';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';

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
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
