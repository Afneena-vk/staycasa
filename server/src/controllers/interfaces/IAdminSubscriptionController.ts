
import { Request, Response, NextFunction } from "express";

export interface IAdminSubscriptionController {
  getAllPlans(req: Request, res: Response, next: NextFunction): Promise<void>;
  updatePlan(req: Request, res: Response, next: NextFunction): Promise<void>;
}
