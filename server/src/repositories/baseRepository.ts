// src/repositories/baseRepository.ts

import { Document, Model, ObjectId } from 'mongoose';
import { IBaseRepository } from './interfaces/IBaseRepository';

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(item: Partial<T>): Promise<T> {
    return await this.model.create(item);
  }

  async findById(id: string | ObjectId): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async findAll(): Promise<T[]> {
    return await this.model.find().exec();
  }

  async update(id: string | ObjectId, data: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string | ObjectId): Promise<T | null> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
