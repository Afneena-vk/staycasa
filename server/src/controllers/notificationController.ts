import { Request, Response,  NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { INotificationService } from "../services/interfaces/INotificationService";
import { INotificationController } from "./interfaces/INotificationController";
import { TOKENS } from "../config/tokens";
import { RecipientModel } from "../models/notificationModel";

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject(TOKENS.INotificationService)
    private _notificationService: INotificationService
  ) {} 

    async createNotification(req: Request, res: Response,next: NextFunction): Promise<void> {
    try {
      const { recipientId, recipientModel, type, title, message, relatedId } = req.body;

      const result = await this._notificationService.createNotification(
        recipientId,
        recipientModel as RecipientModel,
        type,
        title,
        message,
        relatedId
      );

      res.status(result.status).json(result);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err });
    }
  }

  async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // const { recipientId, recipientModel } = req.params;
   const recipientId = (req as any).userId;
   const userType = (req as any).userType; 
   
    const recipientModel =
      userType === "user"
        ? "User"
        : userType === "owner"
        ? "Owner"
        : "Admin";

      const result = await this._notificationService.getNotifications(
        recipientId,
        recipientModel as RecipientModel
      );

       res.status(result.status).json(result);
    } catch (err) {
       res.status(500).json({ message: "Server error", error: err });
    }
  }

  async getNotificationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { notificationId } = req.params;

      const result = await this._notificationService.getNotificationById(notificationId);

      res.status(result.status).json(result);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err });
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { notificationId } = req.params;
       const userId = (req as any).userId;

      const result = await this._notificationService.markAsRead(notificationId,userId);

      res.status(result.status).json(result);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err });
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const recipientId = (req as any).userId;
      const userType = (req as any).userType;

     const recipientModel =
      userType === "user"
        ? "User"
        : userType === "owner"
        ? "Owner"
        : "Admin";

      const result = await this._notificationService.markAllAsRead(
        recipientId,
        recipientModel as RecipientModel
      );

       res.status(result.status).json(result);
    } catch (err) {
       res.status(500).json({ message: "Server error", error: err });
    }
  }

async deleteNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { notificationId } = req.params;

      const result = await this._notificationService.deleteNotification(notificationId);

       res.status(result.status).json(result);
    } catch (err) {
       res.status(500).json({ message: "Server error", error: err });
    }
  }
}
