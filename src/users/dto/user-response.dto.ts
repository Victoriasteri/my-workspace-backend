import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UserResponseDto extends OmitType(CreateUserDto, ['password']) {
  id: string;
}

export class UserLoginResponse {
  access_token: string;
  user: UserResponseDto;
}

export class MeResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User role',
    example: 'user',
    enum: ['user', 'admin'],
  })
  role: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName: string;
}
