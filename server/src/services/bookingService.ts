import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../config/tokens';
import {IBookingService, IRazorpayOrderInput, IRazorpayOrderOutput, UserBookingsQueryOptions} from './interfaces/IBookingService';
import { IPropertyService } from './interfaces/IPropertyService';
import { IPropertyRepository } from '../repositories/interfaces/IPropertyRepository';
import { IBookingRepository } from '../repositories/interfaces/IBookingRepository';
import Razorpay from 'razorpay';
import crypto from "crypto";
import { IPaymentVerificationInput} from "./interfaces/IBookingService";
import { IBooking } from '../models/bookingModel';
import mongoose from 'mongoose';
import { BookingStatus, PaymentStatus } from "../models/status/status";
import { BookingResponseDto, VerifyPaymentResponseDto, CalculateTotalResponseDto, CreateRazorpayOrderResponseDto, BookingListItemDto, BookingDetailsDto} from '../dtos/booking.dto';
import { BookingMapper } from '../mappers/bookingMapper';
import { STATUS_CODES, MESSAGES } from '../utils/constants';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

@injectable()
export class BookingService implements IBookingService {
  
  constructor(
    @inject(TOKENS.IPropertyRepository) private _propertyRepository: IPropertyRepository,
    @inject(TOKENS.IBookingRepository) private _bookingRepository : IBookingRepository
  ) {}


  async calculateTotal(propertyId:string, rentalPeriod:number): Promise<CalculateTotalResponseDto> {
    const property = await this._propertyRepository.findByPropertyId(propertyId);
    if (!property) {
    throw new Error(MESSAGES.ERROR.PROPERTY_NOT_FOUND);
  }
     const totalAmount =property.pricePerMonth * rentalPeriod;
     return BookingMapper.toCalculateTotalResponse(totalAmount)
  }


   async createRazorpayOrder({
    propertyId,
    rentalPeriod,
    userId,
    guests,
    moveInDate,
  }: {
    propertyId: string;
    rentalPeriod: number;
    userId: string;
    guests: number;
    moveInDate: string;
//   }): Promise<{ totalAmount: number; razorpayOrderId: string }> {
  }): Promise<CreateRazorpayOrderResponseDto> {
       const property = await this._propertyRepository.findByPropertyId(propertyId);
    if (!property) throw new Error(MESSAGES.ERROR.PROPERTY_NOT_FOUND);

     if (guests > property.maxGuests) {
      throw new Error(`Maximum ${property.maxGuests} guests allowed.`);
    }

     const checkInDate = new Date(moveInDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      throw new Error(MESSAGES.ERROR.INVALID_MOVE_IN_DATE);
    }

      if (
      rentalPeriod < property.minLeasePeriod ||
      rentalPeriod > property.maxLeasePeriod
    ) {
      throw new Error(
        `Lease period must be between ${property.minLeasePeriod} and ${property.maxLeasePeriod} months.`
      );
    }

  const endDate = new Date(checkInDate);
    endDate.setMonth(endDate.getMonth() + rentalPeriod);

    const conflictBooking =
      await this._bookingRepository.findConflictingBookings(
        propertyId,
        checkInDate,
        endDate
      );

    if (conflictBooking) {
      throw new Error(MESSAGES.ERROR.PROPERTY_ALREADY_BOOKED);
    }
 const amount = property.pricePerMonth * rentalPeriod * 100;

    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: "INR",
    //   receipt: `booking_${userId}_${Date.now()}`,
    receipt: `bk_${userId.slice(-6)}_${Date.now()}`

    });

    // return {
    //   totalAmount: amount / 100,
    //   razorpayOrderId: razorpayOrder.id,
    // };
return BookingMapper.toCreateOrderResponse(
   amount / 100,
    razorpayOrder.id
)

  }

 async verifyPayment(
   input: IPaymentVerificationInput
  ): Promise<VerifyPaymentResponseDto> {
    
     const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    propertyId,
    moveInDate,
    rentalPeriod,
    guests,
    userId
  } = input;
    const secret = process.env.RAZORPAY_KEY_SECRET!;

    const generated = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated !== razorpay_signature) {
      throw new Error(MESSAGES.ERROR.INVALID_PAYMENT_SIGNATURE);
    }

   
const payment = await razorpay.payments.fetch(razorpay_payment_id);

if (payment.status !== "captured") {
  throw new Error(MESSAGES.ERROR.PAYMENT_NOT_COMPLETED)
}



     const property = await this._propertyRepository.findByPropertyId(propertyId);
  if (!property) throw new Error("Property not found");
    
   


  const startDate = new Date(moveInDate);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + rentalPeriod);

  
  const conflict = await this._bookingRepository.findConflictingBookings(
    propertyId,
    startDate,
    endDate
  );
  if (conflict) throw new Error("Property already booked");

  const totalCost = property.pricePerMonth * rentalPeriod;

 const booking = await this._bookingRepository.create({

    userId: new mongoose.Types.ObjectId(userId),
    ownerId: property.ownerId as any,
    propertyId: new mongoose.Types.ObjectId(propertyId),
    moveInDate: startDate,
    endDate,
    rentalPeriod,
    guests,
    rentPerMonth: property.pricePerMonth,
    totalCost,
    paymentMethod: "razorpay",
    paymentId: razorpay_payment_id,
    paymentStatus:  PaymentStatus.Completed,
    bookingStatus:  BookingStatus.Confirmed,
    isCancelled: false,
    refundAmount: 0
  });


await this._propertyRepository.update(propertyId, { isBooked: true });

  
const populatedBooking = await this._bookingRepository.findById(booking._id.toString());


  const bookedProperty = await this._propertyRepository.findByPropertyId(propertyId);

  
  if (bookedProperty?.isBooked) {
    console.log("Property is booked:", bookedProperty);
  } else {
    console.log("Property is not booked yet:", bookedProperty);
  }


 
  
  return BookingMapper.toVerifyPaymentResponse( populatedBooking || booking,"Booking confirmed successfully",property);
  }



  async getUserBookingsWithQuery(
  userId: string,
  query: UserBookingsQueryOptions
): Promise<{ bookings:  BookingListItemDto[]; total: number; page: number; limit: number, totalPages: number }> {

  const page = query.page || 1;
  const limit = query.limit || 9;
  //const sortField = query.sortField || "createdAt";
  const allowedSortFields: (keyof IBooking)[] = ["bookingId", "moveInDate", "paymentStatus", "createdAt"];
  const sortField = allowedSortFields.includes(query.sortField as keyof IBooking)
    ? (query.sortField as keyof IBooking)
    : "createdAt";
  
  

  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";
 

  const { bookings, total } = await this._bookingRepository.findByUserWithQuery(userId,  {
    ...query,
    page,
    limit,
    sortField,
    sortOrder,
  }

  );

 // const bookingDtos = bookings.map(BookingMapper.toBookingResponse);
   const bookingDtos = BookingMapper.toDtoList(bookings);

  return { bookings: bookingDtos, total, page, limit,totalPages: Math.ceil(total / limit)  };
}

async getBookingDetails(bookingId: string, userId: string): Promise<BookingDetailsDto> {
    const booking = await this._bookingRepository.findByIdAndUser(
      bookingId,
      userId
    );

    if (!booking) {
    throw new Error(MESSAGES.ERROR.BOOKING_NOT_FOUND);
  }

  return BookingMapper.toBookingDetailsDto(booking);

}

}