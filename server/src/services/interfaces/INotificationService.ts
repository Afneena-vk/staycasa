import { INotification, RecipientModel } from "../../models/notificationModel";
import { NotificationDto } from "../../dtos/notification.dto";

export interface INotificationService {

  createNotification(
    recipientId: string,
    recipientModel: RecipientModel,
    type: string,
    title: string,
    message: string,
    relatedId?: string | null
  ): Promise<{ message: string; status: number; data: NotificationDto  }> ;

  
   getNotifications(
    recipientId: string,
    recipientModel: RecipientModel
  ): Promise<{ message: string; status: number; data: NotificationDto[] }>;

   markAsRead(
    notificationId: string,
    recipientId: string
  ): Promise<{ message: string; status: number; data: INotification | null }>;
  
   markAllAsRead(
    recipientId: string,
    recipientModel: RecipientModel
  ): Promise<{ message: string; status: number; updatedCount: number }>;
  
   deleteNotification(
    notificationId: string
  ): Promise<{ message: string; status: number }>  
  
   getNotificationById(
  notificationId: string
): Promise<{ message: string; status: number; data: INotification | null }> 


}