// src/controllers/interfaces/IUserController.ts

import { Request, Response, NextFunction } from "express";

export interface IUserController {
  signup(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
  googleCallback(req: Request, res: Response, next: NextFunction): Promise<void>;
}
