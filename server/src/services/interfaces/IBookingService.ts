import { IBooking } from "../../models/bookingModel";
import { VerifyPaymentResponseDto, CalculateTotalResponseDto, CreateRazorpayOrderResponseDto} from "../../dtos/booking.dto";

export interface IRazorpayOrderInput {
  propertyId: string;
  rentalPeriod: number;
  userId: string;
  guests: number;
  moveInDate: string; // ISO string
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


export interface IBookingService {

calculateTotal(propertyId: string, rentalPeriod: number): Promise<CalculateTotalResponseDto>;   
createRazorpayOrder(input: IRazorpayOrderInput): Promise<CreateRazorpayOrderResponseDto>;
verifyPayment(input: IPaymentVerificationInput): Promise<VerifyPaymentResponseDto>; 

}