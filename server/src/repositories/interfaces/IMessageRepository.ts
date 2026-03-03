
import { IBaseRepository } from './IBaseRepository';
import { IMessage } from '../../models/messageModel';
import { ConversationListDTO } from '../../dtos/message.dto';
import mongoose from 'mongoose';

export interface IMessageRepository extends IBaseRepository<IMessage> {
  getConversation(userId: string, ownerId: string, propertyId: string): Promise<IMessage[]>;
  markAsRead(receiverId: string, senderId: string, propertyId: string): Promise<void>;
  //getConversationList(userId: string, userModel: 'User' | 'Owner'): Promise<any[]>;
  getConversationList(userId: string,userModel: 'User' | 'Owner'): Promise<ConversationListDTO[]>;
  saveMessage(data: {
  sender: mongoose.Types.ObjectId;
  senderModel: 'User' | 'Owner';
  receiver: mongoose.Types.ObjectId;
  receiverModel: 'User' | 'Owner';
  propertyId: mongoose.Types.ObjectId;
  content?: string;
  image?: string;
}): Promise<IMessage>;
}
