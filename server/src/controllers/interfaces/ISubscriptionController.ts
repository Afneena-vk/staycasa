
import { Request, Response, NextFunction } from "express";

export interface ISubscriptionController {
  getAllPlans(req: Request, res: Response, next: NextFunction): Promise<void>;
  subscribe(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCurrentSubscription(req: Request, res: Response, next: NextFunction): Promise<void>;
  createSubscriptionOrder(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifySubscriptionPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
}
