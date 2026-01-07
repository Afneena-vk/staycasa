import { IBooking } from "../../models/bookingModel";
import { VerifyPaymentResponseDto, CalculateTotalResponseDto, CreateRazorpayOrderResponseDto, BookingResponseDto, BookingListItemDto, BookingDetailsDto, OwnerBookingStatsDto, CancelBookingResult} from "../../dtos/booking.dto";

export interface IRazorpayOrderInput {
  propertyId: string;
  rentalPeriod: number;
  userId: string;
  guests: number;
  moveInDate: string; 
}

export interface IRazorpayOrderOutput {
  totalAmount: number;
  razorpayOrderId: string;
}

export interface IPaymentVerificationInput {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  propertyId: string;
  rentalPeriod: number;
  guests: number;
  moveInDate: string;
  userId: string;
}

export interface UserBookingsQueryOptions {
  // search?: string;
  // status?: string;
  // paymentStatus?: string;
  // startDate?: string; // ISO string from query
  // endDate?: string;   // ISO string from query
  // page?: string;      // from query params
  // limit?: string;     // from query params
  // sortField?: keyof IBooking;
  // sortOrder?: "asc" | "desc";
   page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  startDate?: Date;
  endDate?: Date;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  bookingType?: "past" | "ongoing" | "upcoming";
}


export interface IBookingService {

calculateTotal(propertyId: string, rentalPeriod: number): Promise<CalculateTotalResponseDto>;   
createRazorpayOrder(input: IRazorpayOrderInput): Promise<CreateRazorpayOrderResponseDto>;
verifyPayment(input: IPaymentVerificationInput): Promise<VerifyPaymentResponseDto>; 
getUserBookingsWithQuery(    
    userId: string,
    query: UserBookingsQueryOptions
  ): Promise<{ bookings: BookingListItemDto[]; total: number; page: number; limit: number,  totalPages: number }>;

getBookingDetails(
   bookingId: string,
   userId:string
): Promise<BookingDetailsDto>;

getOwnerBookingDetails(
   bookingId: string,
   ownerId:string
): Promise<BookingDetailsDto>;

getBlockedDates(propertyId: string): Promise<{ moveInDate: string; endDate: string }[]> 

getOwnerBookingsWithQuery(
  ownerId: string,
  query: UserBookingsQueryOptions
) : Promise<{ bookings: BookingListItemDto[]; total: number; page: number; limit: number,  totalPages: number }>;

getOwnerBookingStatistics(ownerId: string): Promise<OwnerBookingStatsDto>

getBookingOverview(): Promise<number> 

userCancellBooking(bookingId:string,userId:string): Promise<CancelBookingResult>
ownerCancelBooking(bookingId: string,ownerId: string): Promise<CancelBookingResult>
   
}