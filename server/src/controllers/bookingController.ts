import { injectable, inject } from "tsyringe";
import { IBookingController } from "./interfaces/IBookingController";
import { Request, Response, NextFunction } from "express";
import { IBookingService } from "../services/interfaces/IBookingService";
import { TOKENS } from "../config/tokens";
import { STATUS_CODES, MESSAGES } from "../utils/constants";
import logger from "../utils/logger";
import { AppError } from "../utils/AppError";

@injectable()
export class BookingController implements IBookingController {
  constructor(
    @inject(TOKENS.IBookingService) private _bookingService: IBookingService
  ) {}

  async calculateTotal(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { propertyId, rentalPeriod } = req.body;
      const result = await this._bookingService.calculateTotal(
        propertyId,
        rentalPeriod
      );

      res.status(result.status).json(result);
    
    } catch (error) {
      next(error);
    }
  }

  async createRazorpayOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { propertyId, rentalPeriod, guests, moveInDate } = req.body;
      
       const userId = req.userId;

      if (!userId) {
        throw new AppError(MESSAGES.ERROR.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
      }

      console.log("Request body:", req.body);
      console.log("UserId:", req.userId);

      const orderData = await this._bookingService.createRazorpayOrder({
        propertyId,
        rentalPeriod,
        userId,
        guests,
        moveInDate,
      });
      res.status(orderData.status).json(orderData);
    
    } catch (error) {
      next(error);
    }
  }

  async verifyPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      
      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        propertyId,
        moveInDate,
        rentalPeriod,
        guests,
        bookingId,
      } = req.body;

     
      const userId = req.userId;

      if (!userId) {
        throw new AppError(MESSAGES.ERROR.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
      }

      const result = await this._bookingService.verifyPayment({
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        propertyId,
        moveInDate,
        rentalPeriod,
        guests,
        bookingId,
        userId,
      });

      res.status(result.status).json(result);
    
    } catch (error) {
      next(error);
    }
  }

  
async createPendingBooking(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      razorpay_order_id,
      propertyId,
      moveInDate,
      rentalPeriod,
      guests,
      errorCode,
      errorDescription
    } = req.body;
    
   

      const userId = req.userId;

      if (!userId) {
        throw new AppError(MESSAGES.ERROR.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
      }

    const result = await this._bookingService.createPendingBooking({
      razorpay_order_id,
      propertyId,
      moveInDate,
      rentalPeriod,
      guests,
      userId,
      errorCode,
      errorDescription
    });

    res.status(result.status).json(result);
  
    } catch (error) {
      next(error);
    }
}  


async retryPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { bookingId } = req.params;
   

       const userId = req.userId;

      if (!userId) {
        throw new AppError(MESSAGES.ERROR.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
      }

    const result = await this._bookingService.retryPayment(bookingId, userId);
    res.status(result.status).json(result);
  
     } catch (error) {
      next(error);
    }
}


  async getUserBooking(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
     

      const userId = req.userId;

      if (!userId) {
        throw new AppError(MESSAGES.ERROR.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
      }

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
      const result = await this._bookingService.getUserBookingsWithQuery(
        userId,
        {
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
            : undefined,
        }
      );
      res.status(STATUS_CODES.OK).json(result);
 
    } catch (error) {
      next(error);
    }
  }

  async getBookingDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { bookingId } = req.params;
     

      const userId = req.userId;

      if (!userId) {
        throw new AppError(MESSAGES.ERROR.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
      }

      const booking = await this._bookingService.getBookingDetails(
        bookingId,
        userId
      );
      console.log("bookingDetails is:", booking);

      res.status(STATUS_CODES.OK).json({
        status: STATUS_CODES.OK,
        booking,
      });
  
    } catch (error) {
      next(error);
    }
  }

  async getBlockedDates(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { propertyId } = req.params;
      const blockedDates = await this._bookingService.getBlockedDates(
        propertyId
      );
      console.log("the blocked dates are:", blockedDates);
      res.status(200).json({ status: 200, blockedDates });
    
    } catch (error) {
      next(error);
    }
  }

  async getOwnerBookings(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      
       const ownerId = req.userId;

      if (!ownerId) {
        throw new AppError(MESSAGES.ERROR.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
      }

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

      const result = await this._bookingService.getOwnerBookingsWithQuery(
        ownerId,
        {
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
            : undefined,
        }
      );

      res.status(STATUS_CODES.OK).json(result);
    
    } catch (error) {
      next(error);
    }
  }

  async getOwnerBookingDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { bookingId } = req.params;
      

      const ownerId = req.userId;

      if (!ownerId) {
        throw new AppError(MESSAGES.ERROR.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
      }

      const booking = await this._bookingService.getOwnerBookingDetails(
        bookingId,
        ownerId
      );

      res.status(STATUS_CODES.OK).json({
        status: STATUS_CODES.OK,
        booking,
      });
    
    } catch (error) {
      next(error);
    }
  }



  async userCancelBooking(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { bookingId } = req.params;
    
      const userId = req.userId;

      if (!userId) {
        throw new AppError(MESSAGES.ERROR.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
      }

      const result = await this._bookingService.userCancellBooking(
        bookingId,
        userId
      );
      res.status(STATUS_CODES.OK).json({
        status: STATUS_CODES.OK,
        data: result,
      });
    
    } catch (error) {
      next(error);
    }
  }

  async ownerCancelBooking(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { bookingId } = req.params;
      

      const ownerId = req.userId;

      if (!ownerId) {
        throw new AppError(MESSAGES.ERROR.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
      }

      const result = await this._bookingService.ownerCancelBooking(
        bookingId,
        ownerId
      );

      res.status(STATUS_CODES.OK).json({
        status: STATUS_CODES.OK,
        data: result,
      });
    
    } catch (error) {
      next(error);
    }
  }

  async getAllBookings(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
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

      const result = await this._bookingService.getAllBookingsWithQuery({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search as string,
        status: status as string,
        paymentStatus: paymentStatus as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        sortField: sortBy as string,
        sortOrder: sortOrder === "asc" ? "asc" : "desc",
        bookingType: bookingType
          ? (bookingType as "past" | "ongoing" | "upcoming")
          : undefined,
      });

      res.status(STATUS_CODES.OK).json({
        status: STATUS_CODES.OK,
        data: result,
      });
 
    } catch (error) {
      next(error);
    }
  }

  async getBookingDetailsForAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { bookingId } = req.params;
      if (!bookingId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          status: STATUS_CODES.BAD_REQUEST,
          error: "Booking ID is required",
        });
        return;
      }
      const bookingDetails =
        await this._bookingService.getBookingDetailsForAdmin(bookingId);

      res.status(STATUS_CODES.OK).json({
        status: STATUS_CODES.OK,
        data: bookingDetails,
      });
 
   } catch (error) {
      next(error);
    }
  }

async getOwnerBookingStats(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
   

      const ownerId = req.userId;

      if (!ownerId) {
        throw new AppError(MESSAGES.ERROR.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
      }

    const stats = await this._bookingService.getOwnerBookingStats(ownerId);

    res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: stats,
    });
  
    } catch (error) {
      next(error);
   }
}


}
