

import { Request, Response, NextFunction } from "express";

export interface IUserController {
  signup(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  resendOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
  googleCallback(req: Request, res: Response, next: NextFunction): Promise<void>;



  // forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  // verifyResetOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  // resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
}
