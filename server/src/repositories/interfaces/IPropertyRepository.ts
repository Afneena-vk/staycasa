import { IBaseRepository } from './IBaseRepository';
import { IProperty } from '../../models/propertyModel';
import { PropertyStatus } from '../../models/status/status';

export interface IPropertyListResult {
  properties: IProperty[];
  totalCount: number;
  totalPages: number;
}

export interface DestinationDto {
  district: string;
  propertyCount: number;
  image: string;
}

export interface PaginatedDestinations {
  data: DestinationDto[];
  total: number;       
  page: number;        
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

  //  getDestinations(): Promise<DestinationDto[]>
  getDestinations(
    search?: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedDestinations>

   getPropertyStatusStatsByOwner(ownerId: string): Promise<{ _id: string; count: number }[]>;
   getPropertyStatusCounts(): Promise<{ _id: string; count: number }[]>;
   countByOwnerId(ownerId: string): Promise<number>;
}