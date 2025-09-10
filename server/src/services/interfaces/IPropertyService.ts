import { CreatePropertyDto, CreatePropertyResponseDto, PropertyResponseDto } from '../../dtos/property.dto';

export interface IPropertyService {
  createProperty(ownerId: string, data: CreatePropertyDto): Promise<CreatePropertyResponseDto>;
  getOwnerProperties(ownerId: string): Promise<PropertyResponseDto[]>;
}