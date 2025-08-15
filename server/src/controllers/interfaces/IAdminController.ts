import { Request, Response, NextFunction } from "express";
export interface IAdminController {
    login(req: Request, res: Response, next: NextFunction): Promise<void>; 
    getUsersList(req: Request, res: Response, next: NextFunction): Promise<void>;
    blockUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    unblockUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUserById(req: Request, res: Response, next: NextFunction): Promise<void>;
    getOwnersList(req: Request, res: Response, next: NextFunction): Promise<void>;
    blockOwner(req: Request, res: Response, next: NextFunction): Promise<void>;
    unblockOwner(req: Request, res: Response, next: NextFunction): Promise<void>;  
    getOwnerById(req: Request, res: Response, next: NextFunction): Promise<void>;
}