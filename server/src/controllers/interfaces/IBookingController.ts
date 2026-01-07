import { Request, Response, NextFunction } from "express";

export interface IBookingController {
    calculateTotal(req: Request, res: Response, next: NextFunction): Promise<void>;
    createRazorpayOrder(req: Request, res: Response, next: NextFunction): Promise<void>;
    verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUserBooking(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBookingDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
    getOwnerBookingDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBlockedDates(req: Request, res: Response, next: NextFunction): Promise<void>;
    getOwnerBookings(req: Request, res: Response, next: NextFunction): Promise<void>;
    getOwnerBookingStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBookingOverview(req: Request, res: Response, next: NextFunction): Promise<void>;
    userCancelBooking(req: Request, res: Response, next: NextFunction): Promise<void>;
    ownerCancelBooking(req: Request, res: Response, next: NextFunction): Promise<void>;
}