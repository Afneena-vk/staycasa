import { injectable, inject } from 'tsyringe';
import { DestinationDto, IPropertyService, UserPropertyFilters, PaginatedDestinations } from './interfaces/IPropertyService';
import { IPropertyRepository } from '../repositories/interfaces/IPropertyRepository';
import { IBookingRepository } from '../repositories/interfaces/IBookingRepository';
import { INotificationService } from './interfaces/INotificationService';
import { TOKENS } from '../config/tokens';
import { CreatePropertyDto, CreatePropertyResponseDto, PropertyResponseDto, UpdatePropertyDto, UpdatePropertyResponseDto, AdminPropertyListResponseDto, AdminPropertyActionResponseDto, OwnerPropertyListResponseDto, UserPropertyListResponseDto, CheckAvailabilityRequestDTO, CheckAvailabilityResponseDTO, OwnerPropertyStatsDto } from '../dtos/property.dto';
import { PropertyMapper } from '../mappers/propertyMapper';
import { MESSAGES, STATUS_CODES } from '../utils/constants';
import { PropertyStatus } from '../models/status/status';
import { Types } from "mongoose";
import Owner, { IOwner } from "../models/ownerModel";
import { IProperty } from '../models/propertyModel';
import mongoose from "mongoose";
import { IOwnerRepository } from '../repositories/interfaces/IOwnerRepository';
import { ISubscriptionRepository } from '../repositories/interfaces/ISubscriptionRepository';
import { AppError } from "../utils/AppError";

@injectable()
export class PropertyService implements IPropertyService {
  constructor(
    @inject(TOKENS.IPropertyRepository) private _propertyRepository: IPropertyRepository,
    @inject(TOKENS.IBookingRepository) private _bookingRepository : IBookingRepository,
    @inject(TOKENS.INotificationService) private _notificationService: INotificationService,
    @inject(TOKENS.IOwnerRepository) private _ownerRepository: IOwnerRepository,
    @inject(TOKENS.ISubscriptionRepository) private _subscriptionRepository: ISubscriptionRepository
  ) {}

  async createProperty(ownerId: string, data: CreatePropertyDto): Promise<CreatePropertyResponseDto> {
    try {

      const owner = await this._ownerRepository.findById(ownerId);

    if (!owner) {
      throw new AppError(MESSAGES.ERROR.VENDOR_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    // if (owner.approvalStatus !== "approved") {
    //   throw { status: STATUS_CODES.FORBIDDEN, message: "Owner is not approved by admin" };
    // }

    if (owner.approvalStatus !== "approved") {
      throw new AppError("Owner is not approved by admin", STATUS_CODES.FORBIDDEN);
    }
    
   const subscription = await this._subscriptionRepository.findActiveByOwnerId(ownerId);

    if (!subscription) {
      throw new AppError(
        "You must have an active subscription to list a property",
        STATUS_CODES.FORBIDDEN
      );
    } 
    
    if (subscription.endDate < new Date()) {
      await this._subscriptionRepository.update(subscription._id.toString(), { status: "Expired" });

      throw new AppError(
        "Your subscription has expired. Please renew to list properties",
        STATUS_CODES.FORBIDDEN
      );
    }


    const usedProperties = await this._propertyRepository.countByOwnerId(ownerId);
    const plan = subscription.planId as any; 
    const maxAllowed = plan.maxProperties; 

    //     if (maxAllowed !== null && usedProperties >= maxAllowed) {
    //   throw {
    //     status: STATUS_CODES.FORBIDDEN,
    //     message: `You have reached your property limit for the ${plan.name} plan`,
    //   };
    // }

    if (maxAllowed !== null && usedProperties >= maxAllowed) {
      throw new AppError(
        `You have reached your property limit for the ${plan.name} plan`,
        STATUS_CODES.FORBIDDEN
      );
    }

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



  } catch (error: unknown) {
  if (error instanceof AppError) throw error;

  if (error instanceof Error) {
    throw new AppError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR);
  }

  throw new AppError("Something went wrong", STATUS_CODES.INTERNAL_SERVER_ERROR);
}
}



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
  } 

  catch (error: unknown) {
  if (error instanceof AppError) throw error;

  if (error instanceof Error) {
    throw new AppError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR);
  }

  throw new AppError("Something went wrong", STATUS_CODES.INTERNAL_SERVER_ERROR);
}
}


  async getOwnerPropertyById(ownerId: string, propertyId:string): Promise<PropertyResponseDto>{
    try {
      const property = await this._propertyRepository.findByPropertyId(propertyId);

      if(!property){

         throw new AppError("Property not found", STATUS_CODES.NOT_FOUND);
      }

      if (property.ownerId.toString() !== ownerId){

         throw new AppError("Unauthorized access to this property", STATUS_CODES.FORBIDDEN);
      }
      return PropertyMapper.toPropertyResponse(property);

      } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    if (error instanceof Error) {
      throw new AppError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR);
    }

    throw new AppError("Something went wrong", STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
  }   

async updateOwnerProperty( ownerId: string, propertyId: string, data: UpdatePropertyDto): Promise<UpdatePropertyResponseDto> {
  try {

    
      const property = await this._propertyRepository.findByPropertyId(propertyId);
    if (!property) {

      throw new AppError("Property not found", STATUS_CODES.NOT_FOUND);
    } 

     if (property.ownerId.toString() !== ownerId) {

       throw new AppError("Unauthorized to update this property", STATUS_CODES.FORBIDDEN);
    } 
    
     const updatedProperty = await this._propertyRepository.updateProperty(propertyId, data);
    if (!updatedProperty) {

      throw new AppError("Failed to update property", STATUS_CODES.BAD_REQUEST);
    }

    return PropertyMapper.toUpdatePropertyResponse(
      updatedProperty,
      "Property updated successfully"
    );


    } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    if (error instanceof Error) {
      throw new AppError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR);
    }

    throw new AppError("Something went wrong", STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

async deleteOwnerProperty(ownerId: string, propertyId: string): Promise<{ message: string; status: number }> {
  try {
    const property = await this._propertyRepository.findByPropertyId(propertyId);

    if (!property) {

       throw new AppError("Property not found", STATUS_CODES.NOT_FOUND);

    }

    if (property.ownerId.toString() !== ownerId) {
      // const err: any = new Error("Unauthorized to delete this property");
      // err.status = STATUS_CODES.FORBIDDEN;
      // throw err;
      throw new AppError("Unauthorized to delete this property", STATUS_CODES.FORBIDDEN);
    }

    const deleted = await this._propertyRepository.deleteByOwner(ownerId, propertyId);

    if (!deleted) {

      throw new AppError("Failed to delete property", STATUS_CODES.BAD_REQUEST);
    }

    return { message: "Property deleted successfully", status: STATUS_CODES.OK };

    } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    if (error instanceof Error) {
      throw new AppError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR);
    }

    throw new AppError("Something went wrong", STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}


async getAllProperties(filters: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  status?: string;
}): Promise<AdminPropertyListResponseDto> {

  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
      status
    } = filters;

    const result = await this._propertyRepository.getAllProperties(
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      status
    );

     return PropertyMapper.toAdminPropertyListResponse(
      result.properties,
      result.totalCount,
      result.totalPages,
      page
    );

  // } catch (error: any) {
  //   const err: any = new Error(error.message || MESSAGES.ERROR.SERVER_ERROR);
  //   err.status = error.status || STATUS_CODES.INTERNAL_SERVER_ERROR;
  //   throw err;
  // }
    } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    if (error instanceof Error) {
      throw new AppError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR);
    }

    throw new AppError("Something went wrong", STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}


async getAdminPropertyById(propertyId: string): Promise<PropertyResponseDto> {
  try {

    const property = await this._propertyRepository.findByPropertyIdForAdmin(propertyId); 
    console.log("propertyDetailsService for admin returning:", property);
    if(!property){

      throw new AppError("Property not found", STATUS_CODES.NOT_FOUND);
    }

    return PropertyMapper.toPropertyResponse(property);
    

   } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    if (error instanceof Error) {
      throw new AppError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR);
    }

    throw new AppError("Something went wrong", STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

async approveProperty(propertyId:string): Promise<AdminPropertyActionResponseDto> {
  
  try {
    
  const property = await this._propertyRepository.findByPropertyId(propertyId);
  
    if (!property) {

       throw new AppError("Property not found", STATUS_CODES.NOT_FOUND);
    }

    const updatedProperty = await this._propertyRepository.updateStatus(propertyId, PropertyStatus.Active);


     
    if (!updatedProperty) {

       throw new AppError("Failed to activate property", STATUS_CODES.BAD_REQUEST);
    }


const ownerId =
  property.ownerId instanceof mongoose.Types.ObjectId
    ? property.ownerId.toString()
    : (property.ownerId as IOwner)._id.toString();
            await this._notificationService.createNotification(
      ownerId,
      "Owner",                          
      "property",                       
      "Property Approved",              
      `Your property "${property.title}" has been approved and is now live.`,
      property._id.toString()           
    );

    return PropertyMapper.toAdminPropertyActionResponse(
      updatedProperty,
      "Property activated successfully"
    )



   } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    if (error instanceof Error) {
      throw new AppError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR);
    }

    throw new AppError("Something went wrong", STATUS_CODES.INTERNAL_SERVER_ERROR);
  }

}  

async rejectProperty(propertyId:string): Promise<AdminPropertyActionResponseDto>{
  try {
    const property = await this._propertyRepository.findByPropertyId(propertyId);
    if(!property){

       throw new AppError("Property not found", STATUS_CODES.NOT_FOUND);
    }

     const updatedProperty = await this._propertyRepository.updateStatus(propertyId, PropertyStatus.Rejected);
 

     if (!updatedProperty) {

       throw new AppError("Failed to reject property", STATUS_CODES.BAD_REQUEST);
    }
   
const ownerId =
  property.ownerId instanceof mongoose.Types.ObjectId
    ? property.ownerId.toString()
    : (property.ownerId as IOwner)._id.toString();
            await this._notificationService.createNotification(
      ownerId,
      "Owner",                          
      "property",                      
      "Property Rejected",              
      `Your property "${property.title}" has been rejected.`,
      property._id.toString()           
    );

    return PropertyMapper.toAdminPropertyActionResponse(
       updatedProperty,
      "Property rejected successfully"
    )


    } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    if (error instanceof Error) {
      throw new AppError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR);
    }

    throw new AppError("Something went wrong", STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

async blockPropertyByAdmin(propertyId: string): Promise<AdminPropertyActionResponseDto> {

  const property = await this._propertyRepository.updateStatus(propertyId, PropertyStatus.Blocked);
  //if (!property) throw new Error("Property not found");
      if (!property) {
      throw new AppError("Property not found", STATUS_CODES.NOT_FOUND);
    }


    const ownerId =
    property.ownerId instanceof mongoose.Types.ObjectId
      ? property.ownerId.toString()
      : (property.ownerId as IOwner)._id.toString();

  await this._notificationService.createNotification(
    ownerId,
    "Owner",
    "property",
    "Property Blocked",
    `Your property "${property.title}" has been blocked by admin.`,
    property._id.toString()
  );


  return PropertyMapper.toAdminPropertyActionResponse(property, "Property blocked successfully");

}

async unblockPropertyByAdmin(propertyId: string): Promise<AdminPropertyActionResponseDto> {
   const property = await this._propertyRepository.updateStatus(propertyId, PropertyStatus.Active);
  // if (!property) throw new Error("Property not found");
      if (!property) {
      throw new AppError("Property not found", STATUS_CODES.NOT_FOUND);
    }


      const ownerId =
    property.ownerId instanceof mongoose.Types.ObjectId
      ? property.ownerId.toString()
      : (property.ownerId as IOwner)._id.toString();

  await this._notificationService.createNotification(
    ownerId,
    "Owner",
    "property",
    "Property Unlocked",
    `Your property "${property.title}" has been unblocked by admin.`,
    property._id.toString()
  );


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

    } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    if (error instanceof Error) {
      throw new AppError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR);
    }

    throw new AppError("Something went wrong", STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

async getActivePropertyById(propertyId: string): Promise<PropertyResponseDto> {
  try {
    const result= await this._propertyRepository.findByPropertyIdForAdmin(propertyId); 
     if(!result){

       throw new AppError("Property not found", STATUS_CODES.NOT_FOUND);
    }
    return PropertyMapper.toPropertyResponse(result);

    } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    if (error instanceof Error) {
      throw new AppError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR);
    }

    throw new AppError("Something went wrong", STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}




async checkAvailability(propertyId: string, checkIn: string, rentalPeriod:number, guests: number): Promise<CheckAvailabilityResponseDTO> {
 try {
  
   const property = await this._propertyRepository.findByPropertyId(propertyId);
   
   if (!property) {
        return PropertyMapper.toCheckAvailabilityResponse(
          false,
          "Property not found"
        );
      }

  //  if(guests > property.maxGuests){
  //     return  { available: false, message: `Maximum ${property.maxGuests} guests allowed.` };
  //  }
if (guests > property.maxGuests) {
        return PropertyMapper.toCheckAvailabilityResponse(
          false,
          `Maximum ${property.maxGuests} guests allowed.`
        );
      }
const checkInDate = new Date(checkIn);
const today = new Date();
today.setHours(0, 0, 0, 0);
if (checkInDate < today) {
  return PropertyMapper.toCheckAvailabilityResponse(
    false,
    "You cannot select a past move-in date."
  );
}
const endDate = new Date(checkInDate);
endDate.setMonth(endDate.getMonth() + rentalPeriod);


 if (
        rentalPeriod < property.minLeasePeriod ||
        rentalPeriod > property.maxLeasePeriod
      ) {
        return PropertyMapper.toCheckAvailabilityResponse(
          false,
          `Lease period must be between ${property.minLeasePeriod} and ${property.maxLeasePeriod} months.`
        );
      }

  // const bookings = await this._bookingRepository.getConfirmedBookingsByPropertyId(propertyId);

  //  const checkInDate = new Date(checkIn);
  //  const checkOutDate = new Date(checkOut);

    // if (checkInDate >= checkOutDate) {
    //   return {
    //     available: false,
    //     message: "Check-out date must be after check-in date",
    //   };
    // }



  // const isOverlapping = bookings.some((b) => {
  //     const existingStart = new Date(b.moveInDate);
  //     const existingEnd = new Date(b.endDate);

  //     return (
  //       (checkInDate >= existingStart && checkInDate < existingEnd) ||
  //       (checkOutDate > existingStart && checkOutDate <= existingEnd) ||
  //       (checkInDate <= existingStart && checkOutDate >= existingEnd)
  //     );
  //   });

  const conflictBooking = await this._bookingRepository.findConflictingBookings(
      propertyId,
      checkInDate,
      endDate
  )


    if (conflictBooking) {
        return PropertyMapper.toCheckAvailabilityResponse(
          false,
          "Property is already booked for the selected dates."
        );
      }

      return PropertyMapper.toCheckAvailabilityResponse(
        true,
        "Property is available!"
      );


  } catch (error: unknown) {
    console.error("Availability check failed:", error);

    if (error instanceof AppError) throw error;

    if (error instanceof Error) {
      throw new AppError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR);
    }

    throw new AppError(
      "Something went wrong",
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }

}

async getDestinations(
    search?: string,
    page: number = 1,
    limit: number = 10
): Promise< PaginatedDestinations> {
  const destinations = await this._propertyRepository.getDestinations(search, page, limit);
  return destinations;

}


async getOwnerPropertyStats(ownerId: string): Promise<OwnerPropertyStatsDto> {
  const stats = await this._propertyRepository.getPropertyStatusStatsByOwner(ownerId);
  return PropertyMapper.toOwnerPropertyStatsDto(stats);
}

async getLatestActiveProperties(limit: number): Promise<UserPropertyListResponseDto> {
  try {
    const properties = await this._propertyRepository.getLatestActiveProperties(limit);

    return PropertyMapper.toUserPropertyListResponse(
      properties,
      properties.length,
      1,
      1
    );


  } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    if (error instanceof Error) {
      throw new AppError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR);
    }

    throw new AppError("Something went wrong", STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}



}