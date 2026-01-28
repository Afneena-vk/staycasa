import { Request, Response, NextFunction } from "express";

export interface IReviewController {
  createReview(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
