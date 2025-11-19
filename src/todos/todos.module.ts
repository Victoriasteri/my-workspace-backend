import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Todo } from './entities/todo.entity';
import { TodosController } from './controllers/todos.controller';
import { TodosService } from './services/todos.services';
import { TodoItem } from './entities/todo-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, TodoItem])],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
