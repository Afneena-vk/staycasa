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
    return Property.find({ ownerId }).sort({ createdAt: -1 }).exec();
  }

  async findByStatus(status: string): Promise<IProperty[]> {
    return Property.find({ status }).exec();
  }

  async updateStatus(propertyId: string, status: string): Promise<IProperty | null> {
    return await this.model.findByIdAndUpdate(
      propertyId,
      { status },
      { new: true }
    )  .populate("ownerId", "name email phone businessName businessAddress")
    .exec();
  }

  async findByPropertyId(propertyId: string): Promise<IProperty | null> {
    return Property.findById(propertyId).exec();
  }
  async findByPropertyIdForAdmin(propertyId: string): Promise<IProperty | null> {
    return Property.findById(propertyId)
    .populate("ownerId", "name email phone businessName businessAddress")
    .exec();
  }


  async updateProperty(propertyId: string, data: Partial<IProperty>): Promise<IProperty | null> {
    return await this.model.findByIdAndUpdate(propertyId, data, { new: true }).exec();
  }

  async deleteByOwner(ownerId: string, propertyId: string): Promise<IProperty | null> {
  return await this.model.findOneAndDelete({
    _id: propertyId,
    ownerId: ownerId
  }).exec();
}

  async getAllProperties(): Promise<IProperty[]>{
      console.log(" Fetching properties from database...");
    return await this.model.find().sort({createdAt:-1}).exec();
  }



} 