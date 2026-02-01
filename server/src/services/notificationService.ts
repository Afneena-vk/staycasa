import { INotificationService } from "./interfaces/INotificationService";
import { INotification, RecipientModel } from "../models/notificationModel";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { Types } from 'mongoose';
import { INotificationRepository } from "../repositories/interfaces/INotificationRepository";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../config/tokens";
import { NotificationMapper } from "../mappers/notificationMapper";
import { NotificationDto} from "../dtos/notification.dto";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TOKENS.INotificationRepository)
    private _notificationRepository: INotificationRepository
  ) {}

 
  async createNotification(
    recipientId: string,
    recipientModel: RecipientModel,
    type: string,
    title: string,
    message: string,
    relatedId?: string | null
  ): Promise<{ message: string; status: number; data: NotificationDto }> {

    const recipientObjectId = new Types.ObjectId(recipientId);

    let relatedObjectId: Types.ObjectId | null = null;
    if (relatedId && Types.ObjectId.isValid(relatedId)) {
      relatedObjectId = new Types.ObjectId(relatedId);
    }

    const notification = await this._notificationRepository.createNotification({
      recipient: recipientObjectId,
      recipientModel,
      type,
      title,
      message,
      relatedId: relatedObjectId,
      read: false
    });

    return {
      message: MESSAGES.SUCCESS.NOTIFICATION_CREATED,
      status: STATUS_CODES.CREATED,
      data: NotificationMapper.toNotificationResponse(notification)
    };
  }


  async getNotifications(
    recipientId: string,
    recipientModel: RecipientModel
  ): Promise<{ message: string; status: number; data: NotificationDto[] }> {
    
    const notifications = await this._notificationRepository.getNotificationsByRecipient(
      new Types.ObjectId(recipientId),
      recipientModel
    );

    return {
      message: MESSAGES.SUCCESS.NOTIFICATIONS_FETCHED,
      status: STATUS_CODES.OK,
      data: NotificationMapper.toNotificationResponseList(notifications)
    };
  }

 
  async markAsRead(
    notificationId: string,
    recipientId: string
  ): Promise<{ message: string; status: number; data: INotification | null }> {

    const updatedNotification = await this._notificationRepository.markAsRead
    (notificationId,new Types.ObjectId(recipientId));
  if (!updatedNotification) {
    return {
      message: MESSAGES.ERROR.NOTIFICATION_NOT_FOUND,
      status: STATUS_CODES.NOT_FOUND,
      data: null
    };
  }
    return {
      message: MESSAGES.SUCCESS.NOTIFICATION_UPDATED,
      status: STATUS_CODES.OK,
      data: updatedNotification
    };
  }

  
  async markAllAsRead(
    recipientId: string,
    recipientModel: RecipientModel
  ): Promise<{ message: string; status: number; updatedCount: number }> {

    const count = await this._notificationRepository.markAllAsRead(
      new Types.ObjectId(recipientId),
      recipientModel
    );

    return {
      message: MESSAGES.SUCCESS.NOTIFICATION_UPDATED,
      status: STATUS_CODES.OK,
      updatedCount: count
    };
  }

  
  async deleteNotification(
    notificationId: string
  ): Promise<{ message: string; status: number }> {

    const notification = await this._notificationRepository.findOne({ _id: notificationId });

    if (!notification) {
      return {
        message: MESSAGES.ERROR.NOTIFICATION_NOT_FOUND,
        status: STATUS_CODES.NOT_FOUND
      };
    }

    await this._notificationRepository.delete(notificationId);

    return {
      message: MESSAGES.SUCCESS.DELETED_SUCCESSFUL,
      status: STATUS_CODES.OK
    };
  }

async getNotificationById(
  notificationId: string
): Promise<{ message: string; status: number; data: INotification | null }> {
  
  const notification = await this._notificationRepository.findOne({ _id: notificationId });

  if (!notification) {
    return {
      message: MESSAGES.ERROR.NOTIFICATION_NOT_FOUND,
      status: STATUS_CODES.NOT_FOUND,
      data: null
    };
  }

  return {
    message: MESSAGES.SUCCESS.NOTIFICATIONS_FETCHED,
    status: STATUS_CODES.OK,
    data: notification
  };
}


}


