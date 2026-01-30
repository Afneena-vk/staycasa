import { Request, Response, NextFunction } from "express";

export interface IReviewController {
  createReview(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  getReviewsByProperty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>; 

  getReviewsByPropertyForAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>; 
  
toggleReviewVisibility(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>; 

}
