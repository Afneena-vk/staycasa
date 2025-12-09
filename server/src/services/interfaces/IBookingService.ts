import { IBooking } from "../../models/bookingModel";

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

calculateTotal(propertyId: string, rentalPeriod: number): Promise<number>;   
createRazorpayOrder(input: IRazorpayOrderInput): Promise<IRazorpayOrderOutput>;
verifyPayment(input: IPaymentVerificationInput): Promise<IBooking>; 

}