

import { Document, ObjectId, FilterQuery } from 'mongoose';

export interface IBaseRepository<T extends Document> {
  create(item: Partial<T>): Promise<T>;
  findById(id: string | ObjectId): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: string | ObjectId, data: Partial<T>): Promise<T | null>;
  delete(id: string | ObjectId): Promise<T | null>;
  findOne(condition: FilterQuery<T>): Promise<T | null>;
}
