import { injectable, inject } from 'tsyringe';
import { IPropertyService, UserPropertyFilters } from './interfaces/IPropertyService';
import { IPropertyRepository } from '../repositories/interfaces/IPropertyRepository';
import { TOKENS } from '../config/tokens';
import { CreatePropertyDto, CreatePropertyResponseDto, PropertyResponseDto, UpdatePropertyDto, UpdatePropertyResponseDto, AdminPropertyListResponseDto, AdminPropertyActionResponseDto, OwnerPropertyListResponseDto, UserPropertyListResponseDto } from '../dtos/property.dto';
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

  // async getOwnerProperties(ownerId: string): Promise<PropertyResponseDto[]> {
  //   try {
  //     const properties = await this._propertyRepository.findByOwnerId(ownerId);
  //     return properties.map(property => PropertyMapper.toPropertyResponse(property));
  //   } catch (error: any) {
  //     const err: any = new Error(error.message || MESSAGES.ERROR.SERVER_ERROR);
  //     err.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
  //     throw err;
  //   }
  // }

  async getOwnerProperties(filters: {
  ownerId: string;
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}): Promise<OwnerPropertyListResponseDto> {
  try {
    const {
      ownerId,
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc"
    } = filters;

    const result = await this._propertyRepository.getOwnerProperties(
      ownerId,
      page,
      limit,
      search,
      sortBy,
      sortOrder
    );

    return PropertyMapper.toAdminPropertyListResponse(
      result.properties,
      result.totalCount,
      result.totalPages,
      page
    );
  } catch (error: any) {
    const err: any = new Error(error.message || "Server Error");
    err.status = error.status || STATUS_CODES.INTERNAL_SERVER_ERROR;
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


async getAllProperties(filters: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}): Promise<AdminPropertyListResponseDto> {

  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc"
    } = filters;

    const result = await this._propertyRepository.getAllProperties(
      page,
      limit,
      search,
      sortBy,
      sortOrder
    );

     return PropertyMapper.toAdminPropertyListResponse(
      result.properties,
      result.totalCount,
      result.totalPages,
      page
    );

  } catch (error: any) {
    const err: any = new Error(error.message || MESSAGES.ERROR.SERVER_ERROR);
    err.status = error.status || STATUS_CODES.INTERNAL_SERVER_ERROR;
    throw err;
  }
}


async getAdminPropertyById(propertyId: string): Promise<PropertyResponseDto> {
  try {

    const property = await this._propertyRepository.findByPropertyIdForAdmin(propertyId); 
    console.log("propertyDetailsService for admin returning:", property);
    if(!property){
      const err: any = new Error("Property not found");
      err.status = STATUS_CODES.NOT_FOUND;
      throw err;
    }

    return PropertyMapper.toPropertyResponse(property);
    
  } catch (error:any) {
     const err: any = new Error(error.message || MESSAGES.ERROR.SERVER_ERROR);
    err.status = error.status || STATUS_CODES.INTERNAL_SERVER_ERROR;
    throw err;
  }
}

async approveProperty(propertyId:string): Promise<AdminPropertyActionResponseDto> {
  
  try {
    
  const property = await this._propertyRepository.findByPropertyId(propertyId);
  
    if (!property) {
      const err: any = new Error("Property not found");
      err.status = STATUS_CODES.NOT_FOUND;
      throw err;
    }

    const updatedProperty = await this._propertyRepository.updateStatus(propertyId, PropertyStatus.Active);
     
    if (!updatedProperty) {
      const err: any = new Error("Failed to activate property");
      err.status = STATUS_CODES.BAD_REQUEST;
      throw err;
    }

    return PropertyMapper.toAdminPropertyActionResponse(
      updatedProperty,
      "Property activated successfully"
    )


  } catch (error:any) {
     console.error("Approve property error:", error);
    const err: any = new Error(error.message || MESSAGES.ERROR.SERVER_ERROR);
    err.status = error.status || STATUS_CODES.INTERNAL_SERVER_ERROR;
    throw err;
  }

}  

async rejectProperty(propertyId:string): Promise<AdminPropertyActionResponseDto>{
  try {
    const property = await this._propertyRepository.findByPropertyId(propertyId);
    if(!property){
        const err: any = new Error("Property not found");
      err.status = STATUS_CODES.NOT_FOUND;
      throw err;
    }

     const updatedProperty = await this._propertyRepository.updateStatus(propertyId, PropertyStatus.Rejected);
 

     if (!updatedProperty) {
      const err: any = new Error("Failed to reject property");
      err.status = STATUS_CODES.BAD_REQUEST;
      throw err;
    }

    return PropertyMapper.toAdminPropertyActionResponse(
       updatedProperty,
      "Property rejected successfully"
    )

  } catch (error: any) {
    const err: any = new Error(error.message || MESSAGES.ERROR.SERVER_ERROR);
    err.status = error.status || STATUS_CODES.INTERNAL_SERVER_ERROR;
    throw err;
  }
}

async blockPropertyByAdmin(propertyId: string): Promise<AdminPropertyActionResponseDto> {

  const property = await this._propertyRepository.updateStatus(propertyId, PropertyStatus.Blocked);
  if (!property) throw new Error("Property not found");

  return PropertyMapper.toAdminPropertyActionResponse(property, "Property blocked successfully");

}

async unblockPropertyByAdmin(propertyId: string): Promise<AdminPropertyActionResponseDto> {
   const property = await this._propertyRepository.updateStatus(propertyId, PropertyStatus.Active);
  if (!property) throw new Error("Property not found");

  return PropertyMapper.toAdminPropertyActionResponse(property, "Property unblocked successfully");
}



async getActiveProperties(params: UserPropertyFilters
): Promise<UserPropertyListResponseDto> {
  try {

    const { page = 1, limit = 10, search, sortBy, sortOrder, category, facilities } = params;
    const result = await this._propertyRepository.getActiveProperties(  
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      category,
      facilities);
   

    return PropertyMapper.toUserPropertyListResponse(
       result.properties,
       result.totalCount,
       result.totalPages,
       page
    );
  } catch (error: any) {
    const err: any = new Error(error.message || MESSAGES.ERROR.SERVER_ERROR);
    err.status = error.status || STATUS_CODES.INTERNAL_SERVER_ERROR;
    throw err;
  }
}

}