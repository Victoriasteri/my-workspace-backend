import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TodoItem } from './todo-item.entity';

@Entity('todos')
export class Todo {
  @ApiProperty({
    description: 'The unique identifier of the todo list',
    example: '1',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Title of the todo list',
    example: 'Shopping',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'Additional field that sets the color of the todo',
    example: '#000000',
  })
  @Column({ nullable: true })
  color: string;

  @OneToMany(() => TodoItem, (todoItem) => todoItem.todo)
  items: TodoItem[];

  @ApiProperty({
    description: 'The date when the todo was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;
}
