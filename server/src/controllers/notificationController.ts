import { Request, Response,  NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { INotificationService } from "../services/interfaces/INotificationService";
import { INotificationController } from "./interfaces/INotificationController";
import { TOKENS } from "../config/tokens";
import { RecipientModel } from "../models/notificationModel";
import { STATUS_CODES, MESSAGES} from "../utils/constants";
import { AppError } from "../utils/AppError";
import { parseParam } from "../utils/parseParam";

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
 
    } catch (error) {
  next(error);
}
  }

  async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // const { recipientId, recipientModel } = req.params;

      const recipientId = req.userId;
      const userType = req.userType;

      

if (!recipientId) {
  throw new AppError(MESSAGES.ERROR.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
}

if (!userType) {
  throw new AppError(MESSAGES.ERROR.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
}
   
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
  
       } catch (error: unknown) {
      next(error);
    }
  }

  async getNotificationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // const { notificationId } = req.params;
      const notificationId = parseParam(req.params.notificationId);

      if (!notificationId) {
        throw new AppError("Notification ID is required", STATUS_CODES.BAD_REQUEST);
      }

      const result = await this._notificationService.getNotificationById(notificationId);

      res.status(result.status).json(result);
  
       } catch (error: unknown) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // const { notificationId } = req.params;

      const notificationId = parseParam(req.params.notificationId);

      if (!notificationId) {
         throw new AppError("Notification ID is required", STATUS_CODES.BAD_REQUEST);
      }
    
      const userId= req.userId;

      if (!userId) {
          throw new AppError(MESSAGES.ERROR.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
      }

      const result = await this._notificationService.markAsRead(notificationId,userId);

      res.status(result.status).json(result);
    
       } catch (error: unknown) {
      next(error);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
     
      const userType = req.userType;
      const recipientId = req.userId;

if (!recipientId) {
  throw new AppError(MESSAGES.ERROR.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
}

if (!userType) {
  throw new AppError(MESSAGES.ERROR.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
}

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
    
       } catch (error: unknown) {
      next(error);
    }
  }

async deleteNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // const { notificationId } = req.params;
      const notificationId = parseParam(req.params.notificationId);

      if (!notificationId) {
        throw new AppError("Notification ID is required", STATUS_CODES.BAD_REQUEST);
      }

      const result = await this._notificationService.deleteNotification(notificationId);

       res.status(result.status).json(result);
    
        } catch (error: unknown) {
      next(error);
    }
  }
}
