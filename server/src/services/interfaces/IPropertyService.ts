import { CreatePropertyDto, CreatePropertyResponseDto, PropertyResponseDto, UpdatePropertyDto, UpdatePropertyResponseDto } from '../../dtos/property.dto';

export interface IPropertyService {
  createProperty(ownerId: string, data: CreatePropertyDto): Promise<CreatePropertyResponseDto>;
  getOwnerProperties(ownerId: string): Promise<PropertyResponseDto[]>;
  getOwnerPropertyById(ownerId: string, propertyId: string): Promise<PropertyResponseDto>
  updateOwnerProperty(ownerId: string, propertyId: string, data: UpdatePropertyDto):Promise<UpdatePropertyResponseDto>
  deleteOwnerProperty(ownerId: string, propertyId: string): Promise<{ message: string; status: number }>;

}