import { BookingStatus, PaymentStatus } from "../models/status/status";

export interface BookingResponseDto {
  id: string;
  bookingId: string;
  userId: string;
  ownerId: string;
  propertyId: string;

  moveInDate: Date;
  endDate: Date;
  rentalPeriod: number;
  guests: number; 

  rentPerMonth: number;
  totalCost: number;

  paymentMethod: string;
  paymentId?: string;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;

  isCancelled: boolean;
  refundAmount: number;

  createdAt: Date;
}

export interface VerifyPaymentResponseDto {
  message: string;
  status: number;
  booking: BookingResponseDto;
   property?: {
    title: string;
    houseNumber: string;
    street: string;
    city: string;
    pricePerMonth: number;
  };
}

export interface CalculateTotalResponseDto{
 status: number;
  message: string;
  totalAmount: number;
}

export interface CreateRazorpayOrderResponseDto {
  status: number;
  message: string;
  totalAmount: number;
  razorpayOrderId: string;
}

