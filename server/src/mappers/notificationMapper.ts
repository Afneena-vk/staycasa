
import { INotification } from "../models/notificationModel";
import { NotificationDto} from "../dtos/notification.dto"

export class NotificationMapper {

  
  static toNotificationResponse(notification: INotification): NotificationDto {
    return {
      id: notification._id.toString(),                     
      recipient: notification.recipient.toString(),        
      recipientModel: notification.recipientModel,        
      type: notification.type,
      title: notification.title,
      message: notification.message,
      read: notification.read,
      relatedId: notification.relatedId ? notification.relatedId.toString() : null,
      createdAt: notification.createdAt
    };
  }

 
  static toNotificationResponseList(notifications: INotification[]): NotificationDto[] {
    return notifications.map(this.toNotificationResponse);
  }


}
