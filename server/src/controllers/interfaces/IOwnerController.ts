// src/controllers/interfaces/IOwnerController.ts

import { Request, Response, NextFunction } from "express";

export interface IOwnerController {
  signup(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  login(req: Request, res: Response, next: NextFunction): Promise<void>;

}
