import { Request, Response, NextFunction } from "express";

export interface IBookingController {
    calculateTotal(req: Request, res: Response, next: NextFunction): Promise<void>;
    createRazorpayOrder(req: Request, res: Response, next: NextFunction): Promise<void>;
    verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
}