import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { TodosService } from '../services/todos.services';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { TodoResponseDto } from '../dto/todo-response.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { CreateTodoItemDto } from '../dto/create-todo-item.dto';
import { UpdateTodoItemDto } from '../dto/update-todo-item.dto';
import { TodoItemResponseDto } from '../dto/todo-item-response.dto';

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  /**
   * Get list of all todos
   */
  @Get()
  async getAll() {
    return await this.todosService.getAll();
  }

  /**
   * Creates a todo list
   */
  @Post()
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  async create(@Body() createTodoDto: CreateTodoDto): Promise<TodoResponseDto> {
    return await this.todosService.create(createTodoDto);
  }

  /**
   * Updates a todo list
   */
  @Put(':id')
  @ApiParam({ name: 'id', description: 'The ID of the todo list' })
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  async update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<TodoResponseDto> {
    return await this.todosService.update(id, updateTodoDto);
  }

  /**
   * Delete a todo list
   */

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'The ID of the todo list' })
  async deleteTodo(@Param('id') id: string) {
    await this.todosService.deleteTodo(id);
  }

  /**
   * Get all the items of a todo
   */
  @Get(':id/items')
  @ApiParam({ name: 'id', description: 'The ID of the todo list' })
  async getAllItems(@Param('id') id: string): Promise<TodoItemResponseDto[]> {
    return await this.todosService.getAllItems(id);
  }

  /**
   * Create an item of a todo list
   */
  @Post(':id/items')
  @ApiParam({ name: 'id', description: 'The ID of the todo list' })
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  async createItem(
    @Param('id') id: string,
    @Body() newItem: CreateTodoItemDto,
  ): Promise<TodoItemResponseDto> {
    return await this.todosService.createItem(id, newItem);
  }

  /**
   * Update an item of a todo list
   */
  @Put(':id/items/:itemId')
  @ApiParam({ name: 'id', description: 'The ID of the todo list' })
  @ApiParam({ name: 'itemId', description: 'The ID of the todo item' })
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  async updateItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() updatedItem: UpdateTodoItemDto,
  ): Promise<TodoItemResponseDto> {
    return await this.todosService.updateItem(id, itemId, updatedItem);
  }

  /**
   * Delete an item of the todo list
   */
  @Delete(':id/items/:itemId')
  @ApiParam({ name: 'id', description: 'The ID of the todo list' })
  @ApiParam({ name: 'itemId', description: 'The ID of the todo item' })
  async deleteTodoItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
  ) {
    await this.todosService.deleteTodoItem(id, itemId);
  }
}
