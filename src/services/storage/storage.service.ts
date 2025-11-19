import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import {
  SUPABASE_BUCKET_NAME,
  SUPABASE_CLIENT,
} from 'src/shared/supabase/supabase.constants';

interface SupabaseResponseBody {
  filePath: string;
  publicUrl: string;
  fileName: string;
  mimeType: string;
  size: number;
}

@Injectable()
export class StorageService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}
  async uploadFile(file: Express.Multer.File): Promise<SupabaseResponseBody> {
    const originalFileName = file.originalname;

    const filename = `${randomUUID()}_${originalFileName}`;

    const filePath = `notes/${filename}`;

    const { error } = await this.supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new InternalServerErrorException(
        'Error uploading file to supabase storage',
      );
    }

    const { data } = this.supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .getPublicUrl(filePath);

    return {
      filePath,
      publicUrl: data.publicUrl,
      fileName: filename,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async deleteFile(filePath: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      throw new InternalServerErrorException(
        'Error deleting file from supabase storage',
      );
    }
  }
}
