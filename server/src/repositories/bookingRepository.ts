import { injectable } from "tsyringe";
import Booking,{IBooking} from '../models/bookingModel';
import { BaseRepository } from "./baseRepository";
import { IBookingRepository } from "./interfaces/IBookingRepository";  
import { BookingStatus } from "../models/status/status";

@injectable()
export class BookingRepository extends BaseRepository<IBooking> implements IBookingRepository {
  constructor() {
    super(Booking);
  }

  async getConfirmedBookingsByPropertyId(propertyId: string): Promise<IBooking[]> {
      return Booking.find({
        propertyId,
        bookingStatus:BookingStatus.Confirmed,
        isCancelled:false,
      }

      )
  }

  async findConflictingBookings(propertyId: string, start:Date, end:Date){
       return Booking.findOne({
        propertyId,
        bookingStatus:BookingStatus.Confirmed,
        isCancelled:false,
        moveInDate: { $lte: end },
        endDate: { $gte: start },
       })
  }

}