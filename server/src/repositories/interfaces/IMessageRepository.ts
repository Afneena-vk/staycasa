
import { IBaseRepository } from './IBaseRepository';
import { IMessage } from '../../models/messageModel';

export interface IMessageRepository extends IBaseRepository<IMessage> {
  getConversation(userId: string, ownerId: string, propertyId: string): Promise<IMessage[]>;
  markAsRead(receiverId: string, senderId: string, propertyId: string): Promise<void>;
  getConversationList(userId: string, userModel: 'User' | 'Owner'): Promise<any[]>;
}
