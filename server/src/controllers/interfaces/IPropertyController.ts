import { Request, Response, NextFunction } from "express";

export interface IPropertyController {
  createProperty(req: Request, res: Response, next: NextFunction): Promise<void>;
  getOwnerProperties(req: Request, res: Response, next: NextFunction): Promise<void>;
}