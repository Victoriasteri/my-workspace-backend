import { IsBoolean, IsString } from 'class-validator';

export class CreateTodoItemDto {
  /**
   * Description of the item
   * @example Buy chocolate
   */
  @IsString()
  description: string;

  /**
   * Boolean field shows if the todo item was completed
   * @example true
   */
  @IsBoolean()
  isCompleted: boolean;
}
