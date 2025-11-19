import { ApiProperty } from '@nestjs/swagger';

export class TodoResponseDto {
  @ApiProperty({
    description: 'ID of the todo',
    example: '1234',
  })
  id: string;

  @ApiProperty({
    description: 'Title of the todo',
    example: 'My first todo list',
  })
  title: string;

  @ApiProperty({
    description: 'Additional field with color code',
    example: '#000000',
  })
  color: string;
}
