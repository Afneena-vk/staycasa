import { IBaseRepository } from './IBaseRepository';
import { IBooking } from "../../models/bookingModel";

export interface FindByUserOptions {
  search?: string;
  status?: string;
  paymentStatus?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
  sortField?: keyof IBooking; // safer than string
  sortOrder?: "asc" | "desc";
}

export interface IBookingRepository extends IBaseRepository<IBooking>{
    getConfirmedBookingsByPropertyId(propertyId:string): Promise<IBooking[]>;
    findConflictingBookings(propertyId: string, start: Date, end: Date): Promise<IBooking|null>;
    findById(id: string): Promise<IBooking | null>;
    findByUserWithQuery(userId:string ,options: FindByUserOptions): Promise<{ bookings: IBooking[]; total: number }>;
}