import { injectable } from "tsyringe";
import Booking,{IBooking} from '../models/bookingModel';
import { BaseRepository } from "./baseRepository";
import { IBookingRepository, FindByUserOptions } from "./interfaces/IBookingRepository";  
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

  async findById(id: string): Promise<IBooking | null> {
  return await Booking.findById(id)
    .populate('propertyId')
    .populate('userId')
    .populate('ownerId');
}


async findByUserId(userId: string): Promise<IBooking[]> {
  return Booking.find({ userId })
    .populate('propertyId')
    .populate('ownerId')
    .sort({ createdAt: -1 }); 
}



async findByUserWithQuery(
  userId: string,
  options: FindByUserOptions
) {
  const {
    search,
    status,
    paymentStatus,
    startDate,
    endDate,
    page = 1,
    limit = 9,
    sortField = "createdAt",
    sortOrder = "desc",
  } = options;

  const query: any = { userId };

  if (status) query.bookingStatus = status;
  if (paymentStatus) query.paymentStatus = paymentStatus;

 
  if (startDate) {
    query.endDate = { $gte: new Date(startDate) };
  }
  if (endDate) {
    query.endDate = { $lt: new Date(endDate) };
  }

  const total = await Booking.countDocuments(query);

  const bookings = await Booking.find(query)
    .populate({
      path: "propertyId",
      match: search
        ? { title: { $regex: search, $options: "i" } }
        : {},
    })
    .populate("ownerId")
    .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  
  const filteredBookings = bookings.filter(b => b.propertyId);

  return { bookings: filteredBookings, total };
}


}