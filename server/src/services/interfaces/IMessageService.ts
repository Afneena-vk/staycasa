
import { IMessage } from '../../models/messageModel';

export interface IMessageService {
  getConversation(userId: string, ownerId: string, propertyId: string): Promise<IMessage[]>;
  saveMessage(data: {
    sender: string;
    senderModel: 'User' | 'Owner';
    receiver: string;
    receiverModel: 'User' | 'Owner';
    propertyId: string;
    content?: string;
    image?: string;
  }): Promise<IMessage>;
  markAsRead(receiverId: string, senderId: string, propertyId: string): Promise<void>;
  getConversationList(userId: string, userModel: 'User' | 'Owner'): Promise<any[]>;
}