import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.services';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
