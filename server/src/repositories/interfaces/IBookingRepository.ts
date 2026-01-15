import { IBaseRepository } from './IBaseRepository';
import { IBooking } from "../../models/bookingModel";


export interface FindByUserOptions {
  search?: string;
  status?: string;
  paymentStatus?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  bookingType?: "past" | "ongoing" | "upcoming"; 
  limit?: number;
  sortField?: keyof IBooking; 
  sortOrder?: "asc" | "desc";
}

// export interface BookedRange {
//   moveInDate: Date;
//   endDate: Date;
// }

export interface IBookingRepository extends IBaseRepository<IBooking>{
    getConfirmedBookingsByPropertyId(propertyId:string): Promise<IBooking[]>;
    findConflictingBookings(propertyId: string, start: Date, end: Date): Promise<IBooking|null>;
    findById(id: string): Promise<IBooking | null>;
    findByUserWithQuery(userId:string ,options: FindByUserOptions): Promise<{ bookings: IBooking[]; total: number }>;
    findByIdAndUser(bookingId:string,userId:string):  Promise<IBooking | null>;
    findByIdAndOwner(bookingId:string,ownerId:string):  Promise<IBooking | null>;
    //getBookedRanges(propertyId:string):Promise<BookedRange[]>
    findByOwnerWithQuery(ownerId: string,options: FindByUserOptions): Promise<{ bookings: IBooking[]; total: number }>;
    findAllByOwner(ownerId: string): Promise<IBooking[]> ;
    findOwnerBookingsByDate(ownerId: string,type: "upcoming" | "ongoing" | "past"): Promise<IBooking[]>;
    findConfirmedPaidBookingsByOwner(ownerId: string): Promise<IBooking[]> ;
    findCancelledBookingsByOwner(ownerId: string): Promise<IBooking[]>;
    countAllConfirmedBookings(): Promise<number>;
    cancellBooking(
     bookingId: string,
     refundAmount: number,
      ): Promise<IBooking | null>

    findAllWithQuery(options: FindByUserOptions): Promise<{ bookings: IBooking[]; total: number }>;
    markCompletedBookings(today: Date): Promise<number>
}