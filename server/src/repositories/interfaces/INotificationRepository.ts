import { IBaseRepository } from './IBaseRepository';
import { INotification, RecipientModel } from "../../models/notificationModel";
import { FilterQuery, Types } from 'mongoose';

export interface INotificationRepository extends IBaseRepository<INotification> {
  createNotification(data: Partial<INotification>): Promise<INotification>;
  getNotificationsByRecipient(
    recipientId: Types.ObjectId,
    recipientModel: RecipientModel
  ): Promise<INotification[]>;
  //markAsRead(notificationId: string | Types.ObjectId): Promise<INotification | null>;
  markAsRead(notificationId: string | Types.ObjectId, recipientId: Types.ObjectId): Promise<INotification | null>
  markAllAsRead(recipientId: Types.ObjectId, recipientModel: RecipientModel): Promise<number>;
  findOne(condition: FilterQuery<INotification>): Promise<INotification | null>;
}
