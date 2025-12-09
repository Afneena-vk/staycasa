//import mongoose, { Schema, Document, ObjectId } from "mongoose";
import mongoose, {Schema, Document } from "mongoose";

import { v4 as uuidv4 } from "uuid";
import { BookingStatus, PaymentStatus } from "./status/status";


export interface IBooking extends Document {
  bookingId: string;
  // userId: ObjectId;
  // ownerId: ObjectId;
  // propertyId: ObjectId;
  userId: mongoose.Types.ObjectId; 
  ownerId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  moveInDate: Date;
  rentalPeriod: number; 
  endDate: Date;
  rentPerMonth: number;
  totalCost: number;
  paymentMethod: string;
  paymentId?: string;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  isCancelled: boolean;
  cancellationReason?: string;
  refundAmount: number;
  createdAt: Date;
  updatedAt: Date;
}



const bookingSchema = new Schema<IBooking>(
  {
    bookingId: {
      type: String,
      unique: true,
      default: () => `BOOK-${uuidv4().split("-")[0].toUpperCase()}`,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "Owner", required: true },
    propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    moveInDate: { type: Date, required: true },
    rentalPeriod: { type: Number, required: true },
    endDate: { type: Date, required: true },
    rentPerMonth: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentId: { type: String },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.Pending,
    },
    bookingStatus: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.Pending,
    },
    isCancelled: { type: Boolean, default: false },
    cancellationReason: { type: String },
    refundAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
export default Booking;
