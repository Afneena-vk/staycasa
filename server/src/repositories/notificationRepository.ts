import { injectable } from 'tsyringe';
import Notification, { INotification, RecipientModel } from '../models/notificationModel';
import { BaseRepository } from './baseRepository';
import { INotificationRepository } from './interfaces/INotificationRepository';
import { FilterQuery, Types } from 'mongoose';


@injectable()
export class NotificationRepository
  extends BaseRepository<INotification>
  implements INotificationRepository
{
  constructor() {
    super(Notification);
  }

  
  async createNotification(data: Partial<INotification>): Promise<INotification> {
    return this.create(data);
  }

  
  async getNotificationsByRecipient(
    recipientId: Types.ObjectId,
    recipientModel: RecipientModel
  ): Promise<INotification[]> {
    return this.model
      .find({ recipient: recipientId, recipientModel })
      .sort({ createdAt: -1 })
      .exec();
  }

  
  async markAsRead(notificationId: string | Types.ObjectId,  recipientId: Types.ObjectId): Promise<INotification | null> {
    return this.model
      // .findByIdAndUpdate(notificationId, { read: true }, { new: true })
      // .exec();  
     .findOneAndUpdate(
      { _id: new Types.ObjectId(notificationId), recipient: recipientId },
      { read: true },
      { new: true }
    )
    .exec();     
  }

  
  async markAllAsRead(
    recipientId: Types.ObjectId,
    recipientModel: RecipientModel
  ): Promise<number> {
    const result = await this.model.updateMany(
      { recipient: recipientId, recipientModel, read: false },
      { read: true }
    ).exec();
    return result.modifiedCount; 
  }

  
  async findOne(condition: FilterQuery<INotification>): Promise<INotification | null> {
    return super.findOne(condition);
  }
}