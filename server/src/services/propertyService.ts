import { injectable, inject } from 'tsyringe';
import { IPropertyService } from './interfaces/IPropertyService';
import { IPropertyRepository } from '../repositories/interfaces/IPropertyRepository';
import { TOKENS } from '../config/tokens';
import { CreatePropertyDto, CreatePropertyResponseDto, PropertyResponseDto } from '../dtos/property.dto';
import { PropertyMapper } from '../mappers/propertyMapper';
import { MESSAGES, STATUS_CODES } from '../utils/constants';
import { PropertyStatus } from '../models/status/status';
import { Types } from "mongoose";


@injectable()
export class PropertyService implements IPropertyService {
  constructor(
    @inject(TOKENS.IPropertyRepository) private _propertyRepository: IPropertyRepository
  ) {}

  async createProperty(ownerId: string, data: CreatePropertyDto): Promise<CreatePropertyResponseDto> {
    try {
      const propertyData = {
        ...data,
        ownerId:new Types.ObjectId(ownerId),
        status: PropertyStatus.Pending,
        averageRating: 0,
        totalReviews: 0,
        isBooked: false,
        isRejected: false,
      };

      const property = await this._propertyRepository.create(propertyData);
      
      return PropertyMapper.toCreatePropertyResponse(
        property,
        "Property added successfully and is pending approval"
      );
    } catch (error: any) {
      const err: any = new Error(error.message || MESSAGES.ERROR.SERVER_ERROR);
      err.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      throw err;
    }
  }

  async getOwnerProperties(ownerId: string): Promise<PropertyResponseDto[]> {
    try {
      const properties = await this._propertyRepository.findByOwnerId(ownerId);
      return properties.map(property => PropertyMapper.toPropertyResponse(property));
    } catch (error: any) {
      const err: any = new Error(error.message || MESSAGES.ERROR.SERVER_ERROR);
      err.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      throw err;
    }
  }
}