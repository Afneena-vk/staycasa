import { injectable, inject } from "tsyringe";
import { IBookingController } from "./interfaces/IBookingController";
import { Request, Response, NextFunction } from "express";
import { IBookingService } from "../services/interfaces/IBookingService";
import { TOKENS } from "../config/tokens";
import { STATUS_CODES, MESSAGES } from "../utils/constants";
import logger from "../utils/logger";

@injectable()
  export class BookingController implements IBookingController {
    constructor(
      @inject(TOKENS.IBookingService) private _bookingService: IBookingService
    ) {}

  async calculateTotal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { propertyId, rentalPeriod } = req.body;
      const totalAmount = await this._bookingService.calculateTotal(propertyId, rentalPeriod);
      console.log('total amount is' , totalAmount );
       res.status(200).json({ totalAmount });
    } catch (err: any) {
       res.status(500).json({ message: err.message || 'Server error' });
    }
  }

  async createRazorpayOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
     try {
       const { propertyId, rentalPeriod, guests, moveInDate } = req.body;
       const userId = (req as any).userId;


   console.log("Request body:", req.body);
   console.log("UserId:", (req as any).userId);
 

      const orderData = await this._bookingService.createRazorpayOrder({
      propertyId,
      rentalPeriod,
      userId,
      guests,
      moveInDate,
    });
    res.status(200).json(orderData);

     } catch (err:any) {
        console.error("Error creating Razorpay order:", err);
    res.status(400).json({ message: err.message || "Server error" });
     } 
  }


  async verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void>{
  try {
    //const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // await this._bookingService.verifyPayment(
    //   razorpay_payment_id,
    //   razorpay_order_id,
    //   razorpay_signature
    // );
        const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      propertyId,
      moveInDate,
      rentalPeriod,
      guests
    } = req.body;
    const userId = (req as any).userId;

       const booking = await this._bookingService.verifyPayment({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      propertyId,
      moveInDate,
      rentalPeriod,
      guests,
      userId
    });


    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Payment verification failed" });
  }
}


}