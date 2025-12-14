import { IBaseRepository } from './IBaseRepository';
import { IBooking } from "../../models/bookingModel";

export interface IBookingRepository extends IBaseRepository<IBooking>{
    getConfirmedBookingsByPropertyId(propertyId:string): Promise<IBooking[]>;
    findConflictingBookings(propertyId: string, start: Date, end: Date): Promise<IBooking|null>;
    findById(id: string): Promise<IBooking | null>;
}