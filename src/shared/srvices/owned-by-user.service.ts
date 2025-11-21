import { NotFoundException } from '@nestjs/common';
import { FindOptionsRelations, Repository } from 'typeorm';

export interface OwnedByUser {
  userId: string;
}

export class UserOwnedService<T extends OwnedByUser> {
  constructor(protected readonly repo: Repository<T>) {}

  async findAllForUser(
    userId: string,
    relations?: FindOptionsRelations<T>,
  ): Promise<T[]> {
    return this.repo.find({
      where: { userId } as any,
      ...(relations && { relations }),
    });
  }

  async findOneForUser(
    id: string,
    userId: string,
    relations?: FindOptionsRelations<T>,
  ): Promise<T | null> {
    return this.repo.findOne({
      where: { id, userId } as any,
      ...(relations && { relations }),
    });
  }

  async createForUser(
    userId: string,
    data: Omit<T, 'id' | 'userId'>,
  ): Promise<T> {
    const entity = this.repo.create({
      ...data,
      userId,
    } as T);

    return this.repo.save(entity);
  }

  async updateForUser(
    id: string,
    userId: string,
    data: Partial<Omit<T, 'id' | 'userId'>>,
  ): Promise<T> {
    const entity = await this.findOneForUser(id, userId);
    if (!entity) {
      throw new NotFoundException('Not found or not owned by user');
    }

    Object.assign(entity, data);
    return this.repo.save(entity);
  }

  async deleteForUser(id: string, userId: string): Promise<void> {
    const entity = await this.findOneForUser(id, userId);
    if (!entity) {
      return;
    }
    await this.repo.remove(entity);
  }
}
