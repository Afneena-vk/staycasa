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
import { BookingResponseDto, VerifyPaymentResponseDto, CalculateTotalResponseDto, CreateRazorpayOrderResponseDto, BookingListItemDto, BookingDetailsDto, OwnerBookingStatsDto, CancelBookingResult, BookingListForAdminDto, OwnerBookingStatsDTo} from '../dtos/booking.dto';
import { BookingMapper } from '../mappers/bookingMapper';
import { STATUS_CODES, MESSAGES } from '../utils/constants';
import { IWalletRepository } from '../repositories/interfaces/IWalletRepository';
import { INotificationService } from './interfaces/INotificationService';
import { AppError } from '../utils/AppError';
import { CreatePendingBookingResponseDto } from '../dtos/booking.dto';

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
    @inject(TOKENS.INotificationService) private _notificationService: INotificationService
  ) {}


  async calculateTotal(propertyId:string, rentalPeriod:number): Promise<CalculateTotalResponseDto> {
    const property = await this._propertyRepository.findByPropertyId(propertyId);
    if (!property) {
   
    throw new AppError(MESSAGES.ERROR.PROPERTY_NOT_FOUND, STATUS_CODES.NOT_FOUND);
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
    // if (!property) throw new Error(MESSAGES.ERROR.PROPERTY_NOT_FOUND);
  if (!property) {
    // throw new Error(MESSAGES.ERROR.PROPERTY_NOT_FOUND);
    throw new AppError(MESSAGES.ERROR.PROPERTY_NOT_FOUND, STATUS_CODES.NOT_FOUND);
  }
     if (guests > property.maxGuests) {
      //throw new Error(`Maximum ${property.maxGuests} guests allowed.`);
      throw new AppError(`Maximum ${property.maxGuests} guests allowed.`, STATUS_CODES.BAD_REQUEST);
    }

     const checkInDate = new Date(moveInDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
     // throw new Error(MESSAGES.ERROR.INVALID_MOVE_IN_DATE);
       throw new AppError(
    MESSAGES.ERROR.INVALID_MOVE_IN_DATE,
    STATUS_CODES.BAD_REQUEST
  );
    }

      if (
      rentalPeriod < property.minLeasePeriod ||
      rentalPeriod > property.maxLeasePeriod
    ) {

        throw new AppError(
    `Lease period must be between ${property.minLeasePeriod} and ${property.maxLeasePeriod} months.`,
    STATUS_CODES.BAD_REQUEST
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
     // throw new Error(MESSAGES.ERROR.PROPERTY_ALREADY_BOOKED);
       throw new AppError(
    MESSAGES.ERROR.PROPERTY_ALREADY_BOOKED,
    STATUS_CODES.CONFLICT
  );
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
    userId,
    bookingId
  } = input;
   

    const secret = process.env.RAZORPAY_KEY_SECRET!;

    const generated = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated !== razorpay_signature) {
    
        throw new AppError(
    MESSAGES.ERROR.INVALID_PAYMENT_SIGNATURE,
    STATUS_CODES.BAD_REQUEST
  );

    }

   
const payment = await razorpay.payments.fetch(razorpay_payment_id);

if (payment.status !== "captured") {

   throw new AppError(
    MESSAGES.ERROR.PAYMENT_NOT_COMPLETED,
    STATUS_CODES.BAD_REQUEST
  );
}

if (bookingId) {
    
    const existingBooking = await this._bookingRepository.findOne({
      bookingId,
      userId: new mongoose.Types.ObjectId(userId),
      paymentStatus: PaymentStatus.Failed,
      bookingStatus: BookingStatus.Pending
    });

    if (!existingBooking) {
     // throw new Error("Booking not found or not eligible for retry");
     throw new AppError(
       "Booking not found or not eligible for retry",
       STATUS_CODES.NOT_FOUND
     );
    }

    const updatedBooking = await this._bookingRepository.update(
      existingBooking._id.toString(),
      {
        paymentId: razorpay_payment_id,
        paymentStatus: PaymentStatus.Completed,
        bookingStatus: BookingStatus.Confirmed,
      }
    );

    await this._propertyRepository.update(
      existingBooking.propertyId.toString(),
      { isBooked: true }
    );

    const property = await this._propertyRepository.findByPropertyId(
      existingBooking.propertyId.toString()
    );

    const ownerId = new mongoose.Types.ObjectId(property!.ownerId.toString());

     await this._walletRepository.creditWallet(ownerId, "owner", {
      type: "credit",
      amount: existingBooking.totalCost,
      description: "Property booking payment received (retry)",
      bookingId: existingBooking._id,
      paymentMethod: "razorpay",
      paymentId: razorpay_payment_id,
      date: new Date()
    });

    const populatedBooking = await this._bookingRepository.findById(
      updatedBooking!._id.toString()
    );



    return BookingMapper.toVerifyPaymentResponse(
      populatedBooking || updatedBooking!,
      "Payment successful. Booking confirmed!",
      property!
    );
  }

     const property = await this._propertyRepository.findByPropertyId(propertyId);
  //if (!property) throw new Error("Property not found");
   if (!property) {
  throw new AppError("Property not found", STATUS_CODES.NOT_FOUND);
} 
   


  const startDate = new Date(moveInDate);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + rentalPeriod);

  
  const conflict = await this._bookingRepository.findConflictingBookings(
    propertyId,
    startDate,
    endDate
  );
 // if (conflict) throw new Error("Property already booked");
if (conflict) {
  throw new AppError("Property already booked", STATUS_CODES.CONFLICT);
}

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



  
const populatedBooking = await this._bookingRepository.findById(booking._id.toString());

await this._notificationService.createNotification(
  userId,
  "User",
  "booking",
  "Booking Confirmed",
  `Your booking for ${property.title} from ${startDate.toDateString()} to ${endDate.toDateString()} is confirmed.`,
  booking._id.toString()
);

await this._notificationService.createNotification(
  property.ownerId.toString(),
  "Owner",
  "booking",
  "New Booking Received",
  `Your property ${property.title} has been booked by ${userId}. Booking dates: ${startDate.toDateString()} - ${endDate.toDateString()}.`,
  booking._id.toString()
);


 return BookingMapper.toVerifyPaymentResponse(
      populatedBooking || booking,
      "Booking confirmed successfully",
      property
    );

  
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
// }): Promise<any> {
}): Promise<CreatePendingBookingResponseDto>{
  const { razorpay_order_id, propertyId, moveInDate, rentalPeriod, guests, userId, errorCode, errorDescription } = input;

  const property = await this._propertyRepository.findByPropertyId(propertyId);
  //if (!property) throw new Error("Property not found");

if (!property) {
  throw new AppError("Property not found", STATUS_CODES.NOT_FOUND);
}

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
    paymentId: razorpay_order_id, 
    paymentStatus: PaymentStatus.Failed,
    bookingStatus: BookingStatus.Pending,
    isCancelled: false,
    refundAmount: 0
  });

  await this._notificationService.createNotification(
  userId,
  "User",
  "booking", 
  "Payment Failed", 
  `Your payment for ${property.title} could not be completed. Please retry.`,
  booking._id.toString() 
);

  return {
    status: STATUS_CODES.OK,
    message: "Booking created with pending status due to payment failure",
    booking: BookingMapper.toBookingResponse(booking),
    canRetry: true
  };
}

async retryPayment(bookingId: string, userId: string): Promise<CreateRazorpayOrderResponseDto> {
  const booking = await this._bookingRepository.findOne({ 
    bookingId, 
    userId: new mongoose.Types.ObjectId(userId),
    paymentStatus: PaymentStatus.Failed,
    bookingStatus: BookingStatus.Pending 
  });

  if (!booking) {
    //throw new Error("Booking not found or not eligible for retry");
      throw new AppError(
    "Booking not found or not eligible for retry",
    STATUS_CODES.NOT_FOUND
  );
  }

  const property = await this._propertyRepository.findByPropertyId(
    booking.propertyId.toString()
  );
  
  //if (!property) throw new Error("Property not found");
if (!property) {
  throw new AppError("Property not found", STATUS_CODES.NOT_FOUND);
}
  
  const conflict = await this._bookingRepository.findConflictingBookings(
    booking.propertyId.toString(),
    booking.moveInDate,
    booking.endDate
  );
  
  if (conflict) {
    // throw new Error("Property no longer available for selected dates");
      throw new AppError(
    "Property no longer available for selected dates",
    STATUS_CODES.CONFLICT
  );
  }

  const amount = booking.totalCost * 100;

  const razorpayOrder = await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt: `retry_${bookingId}_${Date.now()}`
  });

  return BookingMapper.toCreateOrderResponse(amount / 100, razorpayOrder.id);
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
    //throw new Error(MESSAGES.ERROR.BOOKING_NOT_FOUND);
   throw new AppError(
    MESSAGES.ERROR.BOOKING_NOT_FOUND,
    STATUS_CODES.NOT_FOUND
   );
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
    //throw new Error(MESSAGES.ERROR.BOOKING_NOT_FOUND);
    throw new AppError(
    MESSAGES.ERROR.BOOKING_NOT_FOUND,
    STATUS_CODES.NOT_FOUND
    );
  }

  return BookingMapper.toBookingDetailsDto(booking);
}



async userCancellBooking(
  bookingId:string,
  userId:string,
  
): Promise<CancelBookingResult> {

 const booking= await this._bookingRepository.findById(bookingId);

  if (!booking) {
    //throw new Error("Booking not found");
      throw new AppError(
    MESSAGES.ERROR.BOOKING_NOT_FOUND,
    STATUS_CODES.NOT_FOUND
  );
  }

    if (booking.userId._id.toString() !== userId) {
   // throw new Error("Unauthorized");
    throw new AppError("Unauthorized", STATUS_CODES.UNAUTHORIZED);
  }

    if (
    booking.bookingStatus !== BookingStatus.Confirmed ||
    booking.paymentStatus !== PaymentStatus.Completed
  ) {
    //throw new Error("Only confirmed and paid bookings can be cancelled");
    throw new AppError(
    "Only confirmed and paid bookings can be cancelled",
    STATUS_CODES.BAD_REQUEST
    );
  }

    if (booking.isCancelled) {
   // throw new Error("Booking already cancelled");
   throw new AppError(
    "Booking already cancelled",
    STATUS_CODES.BAD_REQUEST
   );

  }

  const property = booking.propertyId as unknown as {
  _id: string;
  title: string;
  city?: string;
};

const user = booking.userId as any;
const userName = user?.name || user?.email || "the user";


  const today = new Date();
  const moveInDate = new Date(booking.moveInDate);

  const diffInDays =  (moveInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    if (diffInDays < 5) {
    //throw new Error("Cancellation allowed only 5 days before move-in");
    throw new AppError(
    "Cancellation allowed only 5 days before move-in",
    STATUS_CODES.BAD_REQUEST
    );
  }

   const refundAmount = booking.totalCost;

   const cancelledBooking = await this._bookingRepository.cancellBooking(
     booking._id.toString(),
    refundAmount,
   );

   if (!cancelledBooking) {
  //throw new Error("Failed to cancel booking");
    throw new AppError(
    "Failed to cancel booking",
    STATUS_CODES.INTERNAL_SERVER_ERROR
  );
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

     await this._notificationService.createNotification(
          booking.ownerId._id.toString(),
          "Owner",
          "booking",
          "Booking Cancelled",
           `The booking for your property ${property.title} by ${userName} has been cancelled.`,
          booking._id.toString()
        );

       await this._notificationService.createNotification(
        userId,
       "User",
       "booking",
       "Booking Cancelled",
      // `Your booking for ${booking.propertyId} has been successfully cancelled. Refund: ₹${refundAmount}`,
            `Your booking for ${property.title} has been successfully cancelled. Refund: ₹${refundAmount}`,
       booking._id.toString()
);     

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
   // if (!booking) throw new Error("Booking not found or unauthorized");

 if (!booking) {
  throw new AppError(
    "Booking not found or unauthorized",
    STATUS_CODES.NOT_FOUND
  );
}

  //  if (booking.isCancelled) throw new Error("Booking already cancelled");
if (booking.isCancelled) {
  throw new AppError(
    "Booking already cancelled",
    STATUS_CODES.BAD_REQUEST
  );
}

    const property = booking.propertyId as unknown as {
  _id: string;
  title: string;
  city?: string;
  [key: string]: any;
};

     

  const cancelledBooking  = await this._bookingRepository.cancellBooking(
    booking._id.toString(),
    0
    // refundAmount
    
  );
  //if (!cancelledBooking) throw new Error("Failed to cancel booking");
if (!cancelledBooking) {
  throw new AppError(
    "Failed to cancel booking",
    STATUS_CODES.INTERNAL_SERVER_ERROR
  );
}

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


   await this._notificationService.createNotification(
     booking.userId._id.toString(),
     "User",
     "booking",
     "Booking Cancelled by Owner",
    //  `Your booking for ${booking.propertyId} has been cancelled by the owner. Refund: ₹${refundAmount}`,
    `Your booking for ${property.title} has been cancelled by the owner. Refund: ₹${refundAmount}`,
     booking._id.toString()
  );

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
    //throw new Error("Booking not found");
    throw new AppError("Booking not found", STATUS_CODES.NOT_FOUND);
  }

  return BookingMapper.toBookingDetailsDto(booking);
}

async completeExpiredBookings(): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const completedCount =
    await this._bookingRepository.markCompletedBookings(today);

  if (completedCount > 0) {
    console.log(` ${completedCount} bookings marked as COMPLETED`);
  }
}

async getOwnerBookingStats(ownerId: string): Promise<OwnerBookingStatsDTo> {
  const stats =
    await this._bookingRepository.getBookingStatusStatsByOwner(ownerId);

  return BookingMapper.toOwnerBookingStatsDTo(stats);
}


}