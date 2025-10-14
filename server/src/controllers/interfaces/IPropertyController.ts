import { Request, Response, NextFunction } from "express";

export interface IPropertyController {
  createProperty(req: Request, res: Response, next: NextFunction): Promise<void>;
  getOwnerProperties(req: Request, res: Response, next: NextFunction): Promise<void>;
  getOwnerPropertyById(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateOwnerProperty(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteOwnerProperty(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllProperties(req: Request, res:Response, next:NextFunction):Promise<void>;  
  getAdminPropertyById(req: Request, res:Response, next:NextFunction):Promise<void>;  
  approveProperty(req: Request, res:Response, next:NextFunction):Promise<void>; 
  rejectProperty(req: Request, res:Response, next:NextFunction):Promise<void>; 
  blockPropertyByAdmin(req: Request, res:Response, next:NextFunction):Promise<void>;
  unblockPropertyByAdmin(req: Request, res:Response, next:NextFunction):Promise<void>;
}