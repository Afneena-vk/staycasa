import { injectable, inject } from 'tsyringe';
import { IPropertyService } from './interfaces/IPropertyService';
import { IPropertyRepository } from '../repositories/interfaces/IPropertyRepository';
import { TOKENS } from '../config/tokens';
import { CreatePropertyDto, CreatePropertyResponseDto, PropertyResponseDto, UpdatePropertyDto, UpdatePropertyResponseDto } from '../dtos/property.dto';
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

  async getOwnerPropertyById(ownerId: string, propertyId:string): Promise<PropertyResponseDto>{
    try {
      const property = await this._propertyRepository.findByPropertyId(propertyId);

      if(!property){
        const err:any = new Error("Property not found");
        err.status = STATUS_CODES.NOT_FOUND;
        throw err;
      }

      if (property.ownerId.toString() !== ownerId){
        const err: any = new Error("Unauthorized access to this property");
        err.status = STATUS_CODES.FORBIDDEN;
        throw err;
      }
      return PropertyMapper.toPropertyResponse(property);
    } catch (error: any) {
      const err: any = new Error(error.message || MESSAGES.ERROR.SERVER_ERROR);
      err.status = error.status || STATUS_CODES.INTERNAL_SERVER_ERROR;
      throw err;
    }
  }   

async updateOwnerProperty( ownerId: string, propertyId: string, data: UpdatePropertyDto): Promise<UpdatePropertyResponseDto> {
  try {

    
      const property = await this._propertyRepository.findByPropertyId(propertyId);
    if (!property) {
      const err: any = new Error("Property not found");
      err.status = STATUS_CODES.NOT_FOUND;
      throw err;
    } 

     if (property.ownerId.toString() !== ownerId) {
      const err: any = new Error("Unauthorized to update this property");
      err.status = STATUS_CODES.FORBIDDEN;
      throw err;
    } 
    
     const updatedProperty = await this._propertyRepository.updateProperty(propertyId, data);
    if (!updatedProperty) {
      const err: any = new Error("Failed to update property");
      err.status = STATUS_CODES.BAD_REQUEST;
      throw err;
    }

    return PropertyMapper.toUpdatePropertyResponse(
      updatedProperty,
      "Property updated successfully"
    );

  } catch (error: any) {
     const err: any = new Error(error.message || MESSAGES.ERROR.SERVER_ERROR);
    err.status = error.status || STATUS_CODES.INTERNAL_SERVER_ERROR;
    throw err;
  }
}

async deleteOwnerProperty(ownerId: string, propertyId: string): Promise<{ message: string; status: number }> {
  try {
    const property = await this._propertyRepository.findByPropertyId(propertyId);

    if (!property) {
      const err: any = new Error("Property not found");
      err.status = STATUS_CODES.NOT_FOUND;
      throw err;
    }

    if (property.ownerId.toString() !== ownerId) {
      const err: any = new Error("Unauthorized to delete this property");
      err.status = STATUS_CODES.FORBIDDEN;
      throw err;
    }

    const deleted = await this._propertyRepository.deleteByOwner(ownerId, propertyId);

    if (!deleted) {
      const err: any = new Error("Failed to delete property");
      err.status = STATUS_CODES.BAD_REQUEST;
      throw err;
    }

    return { message: "Property deleted successfully", status: STATUS_CODES.OK };
  } catch (error: any) {
    const err: any = new Error(error.message || MESSAGES.ERROR.SERVER_ERROR);
    err.status = error.status || STATUS_CODES.INTERNAL_SERVER_ERROR;
    throw err;
  }
}


}