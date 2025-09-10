import { IBaseRepository } from './IBaseRepository';
import { IProperty } from '../../models/propertyModel';

export interface IPropertyRepository extends IBaseRepository<IProperty> {
  findByOwnerId(ownerId: string): Promise<IProperty[]>;
  findByStatus(status: string): Promise<IProperty[]>;
  updateStatus(propertyId: string, status: string): Promise<IProperty | null>;
}