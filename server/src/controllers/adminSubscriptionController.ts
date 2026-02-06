import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { TOKENS } from "../config/tokens";
import { IAdminSubscriptionService } from "../services/interfaces/IAdminSubscriptionService";
import { IAdminSubscriptionController } from "./interfaces/IAdminSubscriptionController";
import { STATUS_CODES, MESSAGES } from "../utils/constants";

@injectable()
export class AdminSubscriptionController implements IAdminSubscriptionController {
  constructor(
    @inject(TOKENS.IAdminSubscriptionService)
    private _adminSubscriptionService: IAdminSubscriptionService,
  ) {}

  async getAllPlans(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const plans = await this._adminSubscriptionService.getAllPlans();
      res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.SUCCESS.SUBSCRIPTION_PLANS_FETCHED,
        data: plans,
      });
      //res.status(200).json({ success: true, data: plans });
    } catch (error) {
      next(error);
    }
  }

  async updatePlan(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { planId } = req.params;
      const { price, duration, maxProperties } = req.body;

      const updatedPlan = await this._adminSubscriptionService.updatePlan(
        planId,
        {
          price,
          duration,
          maxProperties,
        },
      );


      res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.SUCCESS.SUBSCRIPTION_PLAN_UPDATED,
        data: updatedPlan,
      });
    } catch (error) {
      next(error);
    }
  }
}
