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
      const result = await this._bookingService.calculateTotal(propertyId, rentalPeriod);
      
       res.status(result.status).json(result);
    } catch (err: any) {
      // res.status(500).json({ message: err.message || 'Server error' });
       res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: err.message || MESSAGES.ERROR.SERVER_ERROR,
      });
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
    res.status(orderData.status).json(orderData);

     } catch (err:any) {
        console.error("Error creating Razorpay order:", err);
    // res.status(err.status).json({ message: err.message || "Server error" });
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: err.message || MESSAGES.ERROR.SERVER_ERROR,
      });
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

       const result = await this._bookingService.verifyPayment({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      propertyId,
      moveInDate,
      rentalPeriod,
      guests,
      userId
    });


    res.status(result.status).json(result);
  } catch (err: any) {
   // res.status(400).json({ message: err.message });
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: err.message || MESSAGES.ERROR.SERVER_ERROR,
      });
  }
}


}