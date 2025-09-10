import { injectable } from 'tsyringe';
import Property, { IProperty } from '../models/propertyModel';
import { BaseRepository } from './baseRepository';
import { IPropertyRepository } from './interfaces/IPropertyRepository';

@injectable()
export class PropertyRepository extends BaseRepository<IProperty> implements IPropertyRepository {
  constructor() {
    super(Property);
  }

  async findByOwnerId(ownerId: string): Promise<IProperty[]> {
    return Property.find({ ownerId }).exec();
  }

  async findByStatus(status: string): Promise<IProperty[]> {
    return Property.find({ status }).exec();
  }

  async updateStatus(propertyId: string, status: string): Promise<IProperty | null> {
    return await this.model.findByIdAndUpdate(
      propertyId,
      { status },
      { new: true }
    ).exec();
  }
}