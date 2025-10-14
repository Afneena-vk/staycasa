import { IProperty } from '../models/propertyModel';
import { PropertyResponseDto, CreatePropertyResponseDto, UpdatePropertyResponseDto } from '../dtos/property.dto';
import { STATUS_CODES } from '../utils/constants';
import { AdminPropertyListResponseDto, AdminPropertyActionResponseDto } from '../dtos/property.dto';
import { IOwner } from '../models/ownerModel';
export class PropertyMapper {
  static toPropertyResponse(property: IProperty): PropertyResponseDto {
    return {
      id: property._id.toString(),
      title: property.title,
      type: property.type,
      description: property.description,
      houseNumber: property.houseNumber,
      street: property.street,
      city: property.city,
      district: property.district,
      state: property.state,
      pincode: property.pincode,
      pricePerMonth: property.pricePerMonth,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      furnishing: property.furnishing,
      maxGuests: property.maxGuests,
      minLeasePeriod: property.minLeasePeriod,
      maxLeasePeriod: property.maxLeasePeriod,
      features: property.features,
      images: property.images,
      status: property.status,
      createdAt: property.createdAt,
      // owner: property.ownerId && typeof property.ownerId === "object" 
      // ? {
      //     id: property.ownerId._id.toString(),
      //     name: property.ownerId.name,
      //     email: property.ownerId.email,
      //     phone: property.ownerId.phone,
      //     businessName: property.ownerId.businessName,
      //     businessAddress: property.ownerId.businessAddress,
      //   }
      // : undefined,
      owner:
  property.ownerId && typeof property.ownerId === "object"
    ? (() => {
        const owner = property.ownerId as IOwner;
        return {
          id: owner._id.toString(),
          name: owner.name,
          email: owner.email,
          phone: owner.phone,
          businessName: owner.businessName,
          businessAddress: owner.businessAddress,
        };
      })()
    : undefined,

      
    };
  }

  static toCreatePropertyResponse(
    property: IProperty,
    message: string
  ): CreatePropertyResponseDto {
    return {
      message,
      status: STATUS_CODES.CREATED,
      property: this.toPropertyResponse(property),
    };
  }
  
   static toUpdatePropertyResponse(
    property: IProperty,
    message: string
  ): UpdatePropertyResponseDto {
    return {
      message,
      status: STATUS_CODES.OK,
      property: this.toPropertyResponse(property),
    };
  }

   static toAdminPropertyListResponse(properties: IProperty[]): AdminPropertyListResponseDto {
    return {
      message: "Properties fetched successfully",
      status: STATUS_CODES.OK,
      properties: properties.map((p) => this.toPropertyResponse(p)),
    };
  }

   static toAdminPropertyActionResponse(property: IProperty, message: string): AdminPropertyActionResponseDto {
    return {
      message,
      status: STATUS_CODES.OK,
      property: this.toPropertyResponse(property),
    };
  }

}