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
import { BookingResponseDto, VerifyPaymentResponseDto, CalculateTotalResponseDto, CreateRazorpayOrderResponseDto, BookingListItemDto, BookingDetailsDto, OwnerBookingStatsDto, CancelBookingResult, BookingListForAdminDto} from '../dtos/booking.dto';
import { BookingMapper } from '../mappers/bookingMapper';
import { STATUS_CODES, MESSAGES } from '../utils/constants';
import { IWalletRepository } from '../repositories/interfaces/IWalletRepository';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

@injectable()
export class BookingService implements IBookingService {
  
  constructor(
    @inject(TOKENS.IPropertyRepository) private _propertyRepository: IPropertyRepository,
    @inject(TOKENS.IBookingRepository) private _bookingRepository : IBookingRepository,
    @inject(TOKENS.IWalletRepository) private _walletRepository : IWalletRepository,
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
    try {

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


//const ownerId = property.ownerId as mongoose.Types.ObjectId;
const ownerId = new mongoose.Types.ObjectId(
  property.ownerId.toString()
);
console.log("OwnerId:", ownerId);
console.log("OwnerId type:", typeof ownerId);
console.log("Wallet payload:", {
  type: "credit",
  amount: totalCost,
  bookingId: booking._id,
});
 
// try {
  await this._walletRepository.creditWallet(
    ownerId,
    "owner",
    {
      type: "credit",
      amount: totalCost,
      description: "Property booking payment received",
      bookingId: booking._id,
      paymentMethod: "razorpay",
      paymentId: razorpay_payment_id,
      date: new Date()
    }
  );
// } catch (error) {
//   console.error(" Wallet credit failed:", error);
//   throw error;
// }


  
const populatedBooking = await this._bookingRepository.findById(booking._id.toString());
 return BookingMapper.toVerifyPaymentResponse(
      populatedBooking || booking,
      "Booking confirmed successfully",
      property
    );

  } catch (error: any) {

    console.error("Payment verification failed:", error.message);

    const property = await this._propertyRepository.findByPropertyId(propertyId);
    if (!property) throw error;

    const startDate = new Date(moveInDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + rentalPeriod);

    const totalCost = property.pricePerMonth * rentalPeriod;

    const pendingBooking = await this._bookingRepository.create({
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
      paymentStatus: PaymentStatus.Failed,
      bookingStatus: BookingStatus.Pending,
      isCancelled: false,
      refundAmount: 0
    });

    throw {
      status: 400,
      bookingId: pendingBooking._id,
      message: "Payment failed. Booking saved as pending."
    };

  // const bookedProperty = await this._propertyRepository.findByPropertyId(propertyId);

  
  // if (bookedProperty?.isBooked) {
  //   console.log("Property is booked:", bookedProperty);
  // } else {
  //   console.log("Property is not booked yet:", bookedProperty);
  // }


 
  
 // return BookingMapper.toVerifyPaymentResponse( populatedBooking || booking,"Booking confirmed successfully",property);
  }
  }


  async createPendingBooking(input: {
  razorpay_order_id: string;
  propertyId: string;
  moveInDate: string;
  rentalPeriod: number;
  guests: number;
  userId: string;
  errorCode?: string;
  errorDescription?: string;
}): Promise<any> {
  const { razorpay_order_id, propertyId, moveInDate, rentalPeriod, guests, userId, errorCode, errorDescription } = input;

  const property = await this._propertyRepository.findByPropertyId(propertyId);
  if (!property) throw new Error("Property not found");

  const startDate = new Date(moveInDate);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + rentalPeriod);
  
  const totalCost = property.pricePerMonth * rentalPeriod;

  // Create booking with pending status and failed payment
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
    paymentId: razorpay_order_id, // Store the order ID
    paymentStatus: PaymentStatus.Failed,
    bookingStatus: BookingStatus.Pending,
    isCancelled: false,
    refundAmount: 0
  });

  return {
    status: STATUS_CODES.OK,
    message: "Booking created with pending status due to payment failure",
    booking: BookingMapper.toBookingResponse(booking),
    canRetry: true
  };
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

async getBlockedDates(propertyId: string): Promise<{ moveInDate: string; endDate: string }[]> {
  const bookings = await this._bookingRepository.getConfirmedBookingsByPropertyId(propertyId);
  return bookings.map(b => ({
    moveInDate: b.moveInDate.toISOString().split("T")[0],
    endDate: b.endDate.toISOString().split("T")[0],
  }));
}

async getOwnerBookingsWithQuery(
  ownerId: string,
  query: UserBookingsQueryOptions
) {
  const page = query.page || 1;
  const limit = query.limit || 10;

  const allowedSortFields: (keyof IBooking)[] = [
    "bookingId",
    "moveInDate",
    "paymentStatus",
    "createdAt",
  ];

  const sortField = allowedSortFields.includes(query.sortField as keyof IBooking)
    ? (query.sortField as keyof IBooking)
    : "createdAt";

  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  const { bookings, total } =
    await this._bookingRepository.findByOwnerWithQuery(ownerId, {
      ...query,
      page,
      limit,
      sortField,
      sortOrder,
    });

  const bookingDtos = BookingMapper.toDtoList(bookings);

  return {
    bookings: bookingDtos,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

async getOwnerBookingDetails(
  bookingId: string,
  ownerId: string
): Promise<BookingDetailsDto> {
    const booking = await this._bookingRepository.findByIdAndOwner(
    bookingId,
    ownerId
  );

  if (!booking) {
    throw new Error(MESSAGES.ERROR.BOOKING_NOT_FOUND);
  }

  return BookingMapper.toBookingDetailsDto(booking);
}

async getOwnerBookingStatistics(ownerId: string): Promise<OwnerBookingStatsDto> {

  const [allBookings,upcoming,ongoing,past,confirmedPaid,cancelled] = await Promise.all([

       this._bookingRepository.findAllByOwner(ownerId),
       this._bookingRepository.findOwnerBookingsByDate(ownerId, "upcoming"),
       this._bookingRepository.findOwnerBookingsByDate(ownerId, "ongoing"),
       this._bookingRepository.findOwnerBookingsByDate(ownerId, "past"),
       this._bookingRepository.findConfirmedPaidBookingsByOwner(ownerId),
       this._bookingRepository.findCancelledBookingsByOwner(ownerId)
  ])

const bookingsByStatus = allBookings.reduce((acc, b)=>{
   acc[b.bookingStatus] = (acc[b.bookingStatus] || 0) + 1;
   return acc;
},{} as Record<BookingStatus, number>);


  const revenue = {
    totalRevenue: confirmedPaid.reduce((sum,b)=>sum+b.totalCost,0),
    refundedAmount: cancelled.reduce((sum, b) => sum + (b.refundAmount || 0), 0),

  }

  const paymentStats = allBookings.reduce((acc,b)=>{
    acc[b.paymentStatus] =(acc[b.paymentStatus] || 0)+1;
    return acc;

  }, {} as Record<PaymentStatus, number>)

    const stats = {
    totalBookings: allBookings.length,
    bookingsByStatus,
    bookingsByTimeline: {
      upcoming: upcoming.length,
      ongoing: ongoing.length,
      past: past.length,
    },
    revenue,
    paymentStats,
  };
 
  return BookingMapper.toOwnerBookingStatsDto(stats);

}

async getBookingOverview(): Promise<number> {
  const totalCount= await this._bookingRepository.countAllConfirmedBookings();
  return totalCount;
}

async userCancellBooking(
  bookingId:string,
  userId:string,
  
): Promise<CancelBookingResult> {

 const booking= await this._bookingRepository.findById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

    if (booking.userId._id.toString() !== userId) {
    throw new Error("Unauthorized");
  }

    if (
    booking.bookingStatus !== BookingStatus.Confirmed ||
    booking.paymentStatus !== PaymentStatus.Completed
  ) {
    throw new Error("Only confirmed and paid bookings can be cancelled");
  }

    if (booking.isCancelled) {
    throw new Error("Booking already cancelled");
  }

  const today = new Date();
  const moveInDate = new Date(booking.moveInDate);

  const diffInDays =  (moveInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    if (diffInDays < 5) {
    throw new Error("Cancellation allowed only 5 days before move-in");
  }

   const refundAmount = booking.totalCost;

   const cancelledBooking = await this._bookingRepository.cancellBooking(
     booking._id.toString(),
    refundAmount,
   );

   if (!cancelledBooking) {
  throw new Error("Failed to cancel booking");
}

   await this._walletRepository.creditWallet(
      booking.userId._id,
    "user",  
    {
        type: "credit",
      amount: refundAmount,
      bookingId: booking._id,
      description: "Refund for cancelled booking",
      paymentMethod: booking.paymentMethod as "razorpay",
      paymentId: booking.paymentId,
      date: new Date(),    
    }
   );
   
     await this._walletRepository.debitWallet(booking.ownerId._id, "owner", {
      type: "debit",
      amount: refundAmount,
      bookingId: booking._id,
      description: "Deducted due to booking cancellation",
      paymentMethod: "wallet",
      date: new Date(),
    });

      cancelledBooking.paymentStatus = PaymentStatus.Refunded;
     await cancelledBooking.save();

  // return {
  //   message: "Booking cancelled successfully. Refund credited to wallet.",
  //   refundAmount,
  //   bookingId: booking.bookingId,
  // };
  return BookingMapper.toCancelBookingResult(
   cancelledBooking,
  "Booking cancelled successfully. Refund credited to wallet."
  )
}

async ownerCancelBooking(bookingId: string, ownerId: string): Promise<CancelBookingResult> {
  const booking = await this._bookingRepository.findByIdAndOwner(bookingId,ownerId);
    if (!booking) throw new Error("Booking not found or unauthorized");

    if (booking.isCancelled) throw new Error("Booking already cancelled");

     

  const cancelledBooking  = await this._bookingRepository.cancellBooking(
    booking._id.toString(),
    0
    // refundAmount
    
  );
  if (!cancelledBooking) throw new Error("Failed to cancel booking");


    if (booking.bookingStatus === BookingStatus.Confirmed &&
      booking.paymentStatus === PaymentStatus.Completed){
         const refundAmount = booking.totalCost;
       await this._walletRepository.creditWallet(booking.userId._id, "user", {
        type: "credit",
        amount: refundAmount,
        bookingId: booking._id,
        description: "Refund due to owner cancellation",
        paymentMethod: booking.paymentMethod as "razorpay",
        paymentId: booking.paymentId,
        date: new Date(),
  });

       await this._walletRepository.debitWallet(booking.ownerId, "owner", {
        type: "debit",
        amount: refundAmount,
        bookingId: booking._id,
        description: "Booking cancelled by owner",
        paymentMethod: "wallet",
        date: new Date(),
      });

             cancelledBooking.refundAmount = refundAmount;
             cancelledBooking.paymentStatus = PaymentStatus.Refunded;
             await cancelledBooking.save();

      }



   

    return BookingMapper.toCancelBookingResult(
    cancelledBooking,
    "Booking cancelled by owner. Refund credited to user wallet."
  );

}


// async getAllBookingsWithQuery(query: UserBookingsQueryOptions): Promise<{ bookings: BookingListItemDto[]; total: number; page: number; limit: number; totalPages: number; }> {
async getAllBookingsWithQuery(query: UserBookingsQueryOptions): Promise<BookingListForAdminDto> {
  

    const page = query.page || 1;
  const limit = query.limit || 10;

  const allowedSortFields: (keyof IBooking)[] = [
    "bookingId",
    "moveInDate",
    "paymentStatus",
    "createdAt",
  ];
  const sortField = allowedSortFields.includes(query.sortField as keyof IBooking)
    ? (query.sortField as keyof IBooking)
    : "createdAt";

  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  const { bookings, total } = await this._bookingRepository.findAllWithQuery({
    ...query,
    page,
    limit,
    sortField,
    sortOrder,
  });

  const bookingDtos = BookingMapper.toDtoList(bookings);
  
  return BookingMapper.toBookingListForAdmin(bookings,total,page,limit)

  // return {
  //   bookings: bookingDtos,
  //   total,
  //   page,
  //   limit,
  //   totalPages: Math.ceil(total / limit),
  // };
}

async getBookingDetailsForAdmin(bookingId: string): Promise<BookingDetailsDto> {
  const booking = await this._bookingRepository.findById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  return BookingMapper.toBookingDetailsDto(booking);
}

}