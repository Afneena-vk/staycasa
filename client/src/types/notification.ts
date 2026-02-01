export interface NotificationDto {
  id: string;              
  recipient: string;       
  recipientModel: string;  
  type: string;           
  title: string;
  message: string;
  read: boolean;
  relatedId?: string | null;
  createdAt: Date;
}
