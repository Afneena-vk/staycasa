import { IBaseRepository } from './IBaseRepository';
import { IProperty } from '../../models/propertyModel';

export interface IPropertyListResult {
  properties: IProperty[];
  totalCount: number;
  totalPages: number;
}

export interface IPropertyRepository extends IBaseRepository<IProperty> {
  findByOwnerId(ownerId: string): Promise<IProperty[]>;
  findByStatus(status: string): Promise<IProperty[]>;
  updateStatus(propertyId: string, status: string): Promise<IProperty | null>;
  //findById(propertyId: string): Promise<IProperty | null>;
  findByPropertyId(propertyId: string): Promise<IProperty | null>;
  findByPropertyIdForAdmin(propertyId: string): Promise<IProperty | null>;
  updateProperty(propertyId: string, data: Partial<IProperty>): Promise<IProperty | null>;
  deleteByOwner(ownerId: string, propertyId: string): Promise<IProperty | null>;
  // getAllProperties(): Promise<IProperty[]>;
  getAllProperties(
  page: number,
  limit: number,
  search: string,
  sortBy: string,
  sortOrder: string
    ): Promise<IPropertyListResult>;
// ): Promise<{
//   properties: IProperty[];
//   totalCount: number;
//   totalPages: number;
// }>;

getOwnerProperties (ownerId: string,
  page: number,
  limit: number,
  search: string,
  sortBy: string,
  sortOrder: string): Promise<IPropertyListResult> 

  getActiveProperties(
     page: number,
    limit: number,
   search?: string,
  sortBy?: string,
  sortOrder?: string,
  category?: string,
  facilities?: string[]
  ):Promise<IPropertyListResult>;

}