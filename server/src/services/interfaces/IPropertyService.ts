import { CreatePropertyDto, CreatePropertyResponseDto, PropertyResponseDto, UpdatePropertyDto, UpdatePropertyResponseDto, AdminPropertyListResponseDto, AdminPropertyActionResponseDto, OwnerPropertyListResponseDto, UserPropertyListResponseDto, OwnerPropertyStatsDto } from '../../dtos/property.dto';
import { IProperty } from '../../models/propertyModel';
export interface PropertyFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
} 

export interface OwnerPropertyFilters {
  ownerId: string;
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface UserPropertyFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  category?: string,
  facilities?: string[],
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


export interface IPropertyService {
  createProperty(ownerId: string, data: CreatePropertyDto): Promise<CreatePropertyResponseDto>;
  //getOwnerProperties(ownerId: string): Promise<PropertyResponseDto[]>;
  getOwnerProperties(filters: OwnerPropertyFilters): Promise<OwnerPropertyListResponseDto>;
  getOwnerPropertyById(ownerId: string, propertyId: string): Promise<PropertyResponseDto>
  updateOwnerProperty(ownerId: string, propertyId: string, data: UpdatePropertyDto):Promise<UpdatePropertyResponseDto>
  deleteOwnerProperty(ownerId: string, propertyId: string): Promise<{ message: string; status: number }>;
  // getAllProperties():Promise<AdminPropertyListResponseDto>
  getAllProperties(filters: PropertyFilters): Promise<AdminPropertyListResponseDto>;
 getActiveProperties(params: UserPropertyFilters): Promise<UserPropertyListResponseDto>;
 getActivePropertyById(propertyId:string):Promise<PropertyResponseDto>

  getAdminPropertyById(propertyId:string): Promise<PropertyResponseDto>
  approveProperty(propertyId:string):Promise<AdminPropertyActionResponseDto>
  rejectProperty(propertyId:string):Promise<AdminPropertyActionResponseDto>
  blockPropertyByAdmin(propertyId:string): Promise<AdminPropertyActionResponseDto>
  unblockPropertyByAdmin(propertyId:string): Promise<AdminPropertyActionResponseDto>

  //checkAvailability(propertyId:string, checkIn:string, checkOut:string, guests:number): Promise<{available: boolean, message: string}>;
  checkAvailability(propertyId:string, checkIn:string, rentalPeriod:number, guests:number): Promise<{available: boolean, message: string}>;
  // getDestinations(): Promise<DestinationDto[]> 
  getDestinations(    
    search?: string,
    page?: number,
    limit?: number): Promise<PaginatedDestinations> 

    getOwnerPropertyStats(ownerId: string): Promise<OwnerPropertyStatsDto>
}