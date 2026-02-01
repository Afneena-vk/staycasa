import { Request, Response, NextFunction } from "express";

export interface INotificationController {
 createNotification(req: Request, res: Response, next: NextFunction): Promise<void>;
 getNotifications(req: Request, res: Response, next: NextFunction): Promise<void>;
 getNotificationById(req: Request, res: Response, next: NextFunction): Promise<void>;
 markAsRead(req: Request, res: Response, next: NextFunction): Promise<void>;
 markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void>;
 deleteNotification(req: Request, res: Response, next: NextFunction): Promise<void>;
}