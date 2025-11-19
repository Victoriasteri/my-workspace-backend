import { IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  /**
   * Title of the todo
   * @example My first todo list
   */
  @IsString()
  title: string;

  /**
   * Additional field with color code
   * @example #000000
   */
  @IsOptional()
  @IsString()
  color?: string;
}
