import { IProperty } from '../models/propertyModel';
import { PropertyResponseDto, CreatePropertyResponseDto, UpdatePropertyResponseDto } from '../dtos/property.dto';
import { STATUS_CODES } from '../utils/constants';

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
}