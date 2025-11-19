import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from '../user.enum';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  @MinLength(6)
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
