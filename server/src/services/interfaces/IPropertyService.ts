import { CreatePropertyDto, CreatePropertyResponseDto, PropertyResponseDto, UpdatePropertyDto, UpdatePropertyResponseDto, AdminPropertyListResponseDto, AdminPropertyActionResponseDto } from '../../dtos/property.dto';

export interface PropertyFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}


export interface IPropertyService {
  createProperty(ownerId: string, data: CreatePropertyDto): Promise<CreatePropertyResponseDto>;
  getOwnerProperties(ownerId: string): Promise<PropertyResponseDto[]>;
  getOwnerPropertyById(ownerId: string, propertyId: string): Promise<PropertyResponseDto>
  updateOwnerProperty(ownerId: string, propertyId: string, data: UpdatePropertyDto):Promise<UpdatePropertyResponseDto>
  deleteOwnerProperty(ownerId: string, propertyId: string): Promise<{ message: string; status: number }>;
  // getAllProperties():Promise<AdminPropertyListResponseDto>
  getAllProperties(filters: PropertyFilters): Promise<AdminPropertyListResponseDto>;

  getAdminPropertyById(propertyId:string): Promise<PropertyResponseDto>
  approveProperty(propertyId:string):Promise<AdminPropertyActionResponseDto>
  rejectProperty(propertyId:string):Promise<AdminPropertyActionResponseDto>
  blockPropertyByAdmin(propertyId:string): Promise<AdminPropertyActionResponseDto>
  unblockPropertyByAdmin(propertyId:string): Promise<AdminPropertyActionResponseDto>
}