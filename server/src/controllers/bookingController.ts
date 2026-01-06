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

async getUserBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
      const userId = (req as any).userId;

       const { 
        page, 
        limit, 
        search, 
        status, 
        paymentStatus, 
        startDate, 
        endDate, 
        sortBy, 
        sortOrder,
        bookingType,
      // } = req.query;
       } = req.body; 
      const result = await this._bookingService.getUserBookingsWithQuery(userId, {
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        search: search as string,
        status: status as string,
        paymentStatus: paymentStatus as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        sortField: sortBy as string,
        sortOrder: sortOrder === "asc" ? "asc" : "desc",
       bookingType: bookingType
       ? (bookingType as "past" | "ongoing" | "upcoming")
       : undefined
      });
       res.status(200).json(result);

    } catch (error: any) {
      res.status(500).json({ message: error.message || "Something went wrong" });
    }
}


async getBookingDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
    const {bookingId}= req.params;
    const userId = (req as any).userId;

    const booking = await this._bookingService.getBookingDetails(bookingId,userId);
    console.log("bookingDetails is:", booking);

      res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      booking,
    });

  } catch (error:any) {
      res.status(STATUS_CODES.NOT_FOUND).json({
      status: STATUS_CODES.NOT_FOUND,
      message: error.message || MESSAGES.ERROR.BOOKING_NOT_FOUND,
    });
  }
}

async getBlockedDates(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { propertyId } = req.params;
    const blockedDates = await this._bookingService.getBlockedDates(propertyId);
    console.log("the blocked dates are:",blockedDates )
    res.status(200).json({ status: 200, blockedDates });
  } catch (err: any) {
    res.status(500).json({ status: 500, message: err.message || "Server error" });
  }
}

async getOwnerBookings(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ownerId = (req as any).userId;
    console.log("Owner ID:", ownerId);

    const {
      page,
      limit,
      search,
      status,
      paymentStatus,
      startDate,
      endDate,
      sortBy,
      sortOrder,
      bookingType,
    } = req.query;
    

    const result =
      await this._bookingService.getOwnerBookingsWithQuery(ownerId, {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search as string,
        status: status as string,
        paymentStatus: paymentStatus as string,
        startDate: startDate as any,
        endDate: endDate as any,
        sortField: sortBy as string,
        sortOrder: sortOrder === "asc" ? "asc" : "desc",
       // bookingType: bookingType as "past" | "ongoing" | "upcoming" 
       bookingType: bookingType
  ? (bookingType as "past" | "ongoing" | "upcoming")
  : undefined

      });

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to fetch owner bookings",
    });
  }
}

async getOwnerBookingDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { bookingId } = req.params;
    const ownerId = (req as any).userId;

    const booking = await this._bookingService.getOwnerBookingDetails(
    bookingId,
    ownerId
    );

      res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      booking,
    });
  } catch (error:any) {
      res.status(STATUS_CODES.NOT_FOUND).json({
      status: STATUS_CODES.NOT_FOUND,
      message: error.message || MESSAGES.ERROR.BOOKING_NOT_FOUND,
    });
  }
}


async getOwnerBookingStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
     const ownerId = (req as any). userId;

     const stats = await this._bookingService.getOwnerBookingStatistics(ownerId)

      res.status(STATUS_CODES.OK).json({
        status: STATUS_CODES.OK,
        stats,
      });

  } catch (err: any) {
      console.error("Error fetching owner booking stats:", err);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: err.message || "Failed to fetch owner booking statistics",
      });
  }
}

async getBookingOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const totalCount = await this._bookingService.getBookingOverview();
    res.status(STATUS_CODES.OK).json({
        status: STATUS_CODES.OK,
        totalCount
      });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  } 
}

async userCancelBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
try {
  const { bookingId } = req.params;
  const userId = (req as any).userId;

  
  const result = await this._bookingService.userCancellBooking(
    bookingId,
    userId,
  
  );
      res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: result,
    });

} catch (error: unknown) {  
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error instanceof Error ? error.message : "Failed to cancel booking",
    });
  }

}


}