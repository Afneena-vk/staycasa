import { Request, Response, NextFunction } from "express";

export interface IAuthController {
     refreshToken(req: Request, res: Response, next: NextFunction): Promise<void>;
}