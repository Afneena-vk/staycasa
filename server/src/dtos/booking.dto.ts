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

export interface BookingListItemDto {
  id: string;
  bookingId: string;

  moveInDate: Date;
  endDate: Date;
  rentalPeriod: number;
  guests: number;
  totalCost: number;

  paymentStatus: string;
  bookingStatus: string;

  property: {
    id: string;
    title: string;
    city: string;
    images: string[];
  };
    user?: {               
    id: string;
    name: string;
    email?: string;
  };

    owner?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    businessName: string;
  };

}


export interface BookingDetailsDto {
  id: string;
  bookingId: string;

  moveInDate: Date;
  endDate: Date;
  rentalPeriod: number;
  guests: number;

  rentPerMonth: number;
  totalCost: number;

  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  paymentId?: string;   
  paymentMethod: string;
  refundAmount: number;

  createdAt: Date;

  property: {
    id: string;
    title: string;
    description: string;
    city: string;
    address: string;
    images: string[];
    pricePerMonth: number;
    bedrooms: number;
    bathrooms: number;
    furnishing: string;
    street: string;
    type: string; 
    district: string;
    state: string;
    pincode: number;
    houseNumber: string;
   
  };

    user?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: {
      houseNo: string;
      street: string;
      city: string;
      district: string;
      state: string;
      pincode: string;
    };
  };


    owner?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    businessName: string;
  };
  
}

export interface OwnerBookingStatsDto {
  totalBookings: number;

  bookingsByStatus: {
    pending: number;
    confirmed: number;
    cancelled: number;
    completed: number;
  };

  bookingsByTimeline: {
    upcoming: number;
    ongoing: number;
    past: number;
  };

  revenue: {
    totalRevenue: number;
    refundedAmount: number;
  };

  paymentStats: {
    paid: number;
    pending: number;
    failed: number;
  };
}

export interface CancelBookingResult {
  message: string;
  refundAmount?: number;
  bookingId?: string;
}

export interface BookingListForAdminDto {
  bookings: BookingListItemDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OwnerBookingStatsDTo {
  confirmed: number;
  pending: number;
  cancelled: number;
  completed: number;
}



