import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../config/tokens';
import {IBookingService, IRazorpayOrderInput, IRazorpayOrderOutput} from './interfaces/IBookingService';
import { IPropertyService } from './interfaces/IPropertyService';
import { IPropertyRepository } from '../repositories/interfaces/IPropertyRepository';
import { IBookingRepository } from '../repositories/interfaces/IBookingRepository';
import Razorpay from 'razorpay';
import crypto from "crypto";
import { IPaymentVerificationInput} from "./interfaces/IBookingService";
import { IBooking } from '../models/bookingModel';
import mongoose from 'mongoose';
import { BookingStatus, PaymentStatus } from "../models/status/status";

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


  async calculateTotal(propertyId:string, rentalPeriod:number): Promise<number> {
    const property = await this._propertyRepository.findByPropertyId(propertyId);
    if (!property) throw new Error('Property not found');
    return property.pricePerMonth * rentalPeriod;
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
  }): Promise<{ totalAmount: number; razorpayOrderId: string }> {
       const property = await this._propertyRepository.findByPropertyId(propertyId);
    if (!property) throw new Error("Property not found");

     if (guests > property.maxGuests) {
      throw new Error(`Maximum ${property.maxGuests} guests allowed.`);
    }

     const checkInDate = new Date(moveInDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      throw new Error("Move-in date cannot be in the past.");
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
      throw new Error("Property is already booked for the selected dates.");
    }
 const amount = property.pricePerMonth * rentalPeriod * 100;

    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: "INR",
    //   receipt: `booking_${userId}_${Date.now()}`,
    receipt: `bk_${userId.slice(-6)}_${Date.now()}`

    });

    return {
      totalAmount: amount / 100,
      razorpayOrderId: razorpayOrder.id,
    };


  }

 async verifyPayment(
   input: IPaymentVerificationInput
  ): Promise<IBooking> {
    //const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = input;
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
      throw new Error("Invalid payment signature");
    }

     const property = await this._propertyRepository.findByPropertyId(propertyId);
  if (!property) throw new Error("Property not found");
    
    // Payment verified → Save booking
    // await this.bookingRepo.createBooking({
    //   razorpay_payment_id,
    //   razorpay_order_id,
    //   // other booking info as needed
    // });

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
    // userId,
     userId: new mongoose.Types.ObjectId(userId),
    ownerId: property.ownerId as any,
    // propertyId,
     propertyId: new mongoose.Types.ObjectId(propertyId),
    moveInDate: startDate,
    endDate,
    rentalPeriod,
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

  
  const bookedProperty = await this._propertyRepository.findByPropertyId(propertyId);

  
  if (bookedProperty?.isBooked) {
    console.log("Property is booked:", bookedProperty);
  } else {
    console.log("Property is not booked yet:", bookedProperty);
  }


 
  await this._propertyRepository.update(propertyId, {
    isBooked: true
  });
  return booking;
  }


}