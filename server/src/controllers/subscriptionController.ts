

import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { TOKENS } from "../config/tokens";
import { ISubscriptionService } from "../services/interfaces/ISubscriptionService";
import { ISubscriptionController } from "./interfaces/ISubscriptionController";
import { STATUS_CODES, MESSAGES } from "../utils/constants";
import { AppError } from "../utils/AppError";

@injectable()
export class SubscriptionController implements ISubscriptionController {
  constructor(
    @inject(TOKENS.ISubscriptionService)
    private _subscriptionService: ISubscriptionService
  ) {}

async getAllPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const plans = await this._subscriptionService.getAllPlans();
      res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.SUCCESS.SUBSCRIPTION_PLANS_FETCHED,
        data: plans,
      });
    } catch (error) {
      next(error);
    }
  }

  async createSubscriptionOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const ownerId = (req as any).userId;
    const { planId } = req.body;

    const order = await this._subscriptionService.createSubscriptionOrder(ownerId, planId);

    res.status(STATUS_CODES.OK).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
}



async verifySubscriptionPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const ownerId = (req as any).userId;
    const { planId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    await this._subscriptionService.verifySubscriptionPayment(
      ownerId,
      planId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature
    );

    res.status(201).json({
      success: true,
      message: "Subscription activated successfully",
    });
  } catch (error) {
    next(error);
  }
}


  async subscribe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = (req as any).userId; 
      const { planId, paymentId } = req.body;

      if (!planId || !paymentId) {
        throw new AppError(MESSAGES.ERROR.MISSING_FIELDS, STATUS_CODES.BAD_REQUEST);
      }

      await this._subscriptionService.subscribe(ownerId, { planId, paymentId });

      res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: MESSAGES.SUCCESS.SUBSCRIPTION_SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  }

async getCurrentSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = (req as any).userId; 
      const data = await this._subscriptionService.getCurrentSubscription(ownerId);

      res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Current subscription fetched successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

async getAllSubscriptions(req: Request, res: Response, next: NextFunction): Promise<void>  {
  try {
    //const { ownerName, planName, status, startDate, endDate } = req.query;

       const ownerName =
      typeof req.query.ownerName === "string" ? req.query.ownerName : undefined;

    const planName =
      typeof req.query.planName === "string" ? req.query.planName : undefined;

    const status =
      req.query.status === "Active" || req.query.status === "Expired"
        ? req.query.status
        : undefined;

    const startDate =
      typeof req.query.startDate === "string"
        ? new Date(req.query.startDate)
        : undefined;

    const endDate =
      typeof req.query.endDate === "string"
        ? new Date(req.query.endDate)
        : undefined;

    const page =
      typeof req.query.page === "string" ? Number(req.query.page) : 1;

    const limit =
      typeof req.query.limit === "string" ? Number(req.query.limit) : 10;


    const subscriptions = await this._subscriptionService.getAllSubscriptions({
      ownerName,
      planName,
      status,
      startDate,
      endDate,
      page,
      limit,
    //   startDate: startDate ? new Date(startDate as string) : undefined,
    //   endDate: endDate ? new Date(endDate as string) : undefined,
    });

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Subscriptions fetched successfully",
      //data: subscriptions,
      data: subscriptions.data,
      pagination: subscriptions.pagination,
    });
  } catch (error) {
    next(error);
  }
}



}
