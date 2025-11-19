import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { TodoResponseDto } from '../dto/todo-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from '../entities/todo.entity';
import { Repository } from 'typeorm';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { TodoItemResponseDto } from '../dto/todo-item-response.dto';
import { CreateTodoItemDto } from '../dto/create-todo-item.dto';
import { UpdateTodoItemDto } from '../dto/update-todo-item.dto';
import { TodoItem } from '../entities/todo-item.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
    @InjectRepository(TodoItem)
    private todoItemRepo: Repository<TodoItem>,
  ) {}

  async create(todo: CreateTodoDto): Promise<TodoResponseDto> {
    const createdTodo = this.todoRepository.create(todo);

    const savedTodo = await this.todoRepository.save(createdTodo);

    return savedTodo;
  }

  async update(id: string, todo: UpdateTodoDto): Promise<TodoResponseDto> {
    const existingTodo = await this.todoRepository.findOne({ where: { id } });

    if (!existingTodo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    Object.assign(existingTodo, todo);

    const updatedTodo = await this.todoRepository.save(existingTodo);

    return updatedTodo;
  }

  async getAll(): Promise<TodoResponseDto[]> {
    const todoList = await this.todoRepository.find({
      relations: ['items'],
    });

    return todoList;
  }

  async deleteTodo(todoId: string) {
    const todo = await this.todoRepository.findOne({
      where: { id: todoId },
    });

    if (!todo) throw new NotFoundException(`todo with ID ${todoId} not found`);

    await this.todoRepository.delete(todoId);
  }

  //////////////////////// todo items related lgic //////////////

  async getAllItems(todoId: string): Promise<TodoItemResponseDto[]> {
    const todo = await this.todoRepository.findOne({ where: { id: todoId } });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${todoId} not found`);
    }

    const allItems = await this.todoItemRepo.find({
      where: { todo: { id: todoId } },
    });

    return allItems.map((item) => ({
      id: item.id,
      description: item.description,
      isCompleted: item.isCompleted,
      todoId,
    }));
  }

  async createItem(
    todoId: string,
    item: CreateTodoItemDto,
  ): Promise<TodoItemResponseDto> {
    const todo = await this.todoRepository.findOne({ where: { id: todoId } });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${todoId} not found`);
    }

    const newItem = this.todoItemRepo.create({
      ...item,
      todo,
    });

    const createdItem = await this.todoItemRepo.save(newItem);

    const itemToReturn: TodoItemResponseDto = {
      id: createdItem.id,
      description: createdItem.description,
      isCompleted: createdItem.isCompleted,
      todoId,
    };

    return itemToReturn;
  }

  async updateItem(
    todoId: string,
    itemId: string,
    updatedItem: UpdateTodoItemDto,
  ): Promise<TodoItemResponseDto> {
    const todo = await this.todoRepository.findOne({
      where: {
        id: todoId,
      },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${todoId} not found`);
    }

    const item = await this.todoItemRepo.findOne({
      where: { id: itemId, todo: { id: todoId } },
    });

    if (!item) {
      throw new NotFoundException(
        `Todo item with ID ${itemId} not found in todo ${todoId}`,
      );
    }

    Object.assign(item, updatedItem);

    const savedItem = await this.todoItemRepo.save(item);

    const itemToReturn: TodoItemResponseDto = {
      id: savedItem.id,
      description: savedItem.description,
      isCompleted: savedItem.isCompleted,
      todoId,
    };

    return itemToReturn;
  }

  async deleteTodoItem(todoId: string, itemId: string) {
    const todo = await this.todoRepository.findOne({
      where: { id: todoId },
    });

    if (!todo) throw new NotFoundException(`todo with ID ${todoId} not found`);

    const item = await this.todoItemRepo.findOne({
      where: { id: itemId, todo: { id: todoId } },
    });

    if (!item) throw new NotFoundException(`item with ID ${itemId} not found`);

    await this.todoItemRepo.delete(itemId);
  }
}
