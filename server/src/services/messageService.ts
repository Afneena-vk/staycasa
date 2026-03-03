
import { injectable, inject } from 'tsyringe';
import { IMessageService } from './interfaces/IMessageService';
import { IMessageRepository } from '../repositories/interfaces/IMessageRepository';
import { TOKENS } from '../config/tokens';
import { IMessage } from '../models/messageModel';

@injectable()
export class MessageService implements IMessageService {
  constructor(
    @inject(TOKENS.IMessageRepository) private _messageRepository: IMessageRepository
  ) {}

  async getConversation(userId: string, ownerId: string, propertyId: string): Promise<IMessage[]> {
    return this._messageRepository.getConversation(userId, ownerId, propertyId);
  }

  async saveMessage(data: {
    sender: string;
    senderModel: 'User' | 'Owner';
    receiver: string;
    receiverModel: 'User' | 'Owner';
    propertyId: string;
    content?: string;
    image?: string;
  }): Promise<IMessage> {
    return this._messageRepository.create(data as any);
  }

  async markAsRead(receiverId: string, senderId: string, propertyId: string): Promise<void> {
    return this._messageRepository.markAsRead(receiverId, senderId, propertyId);
  }

  async getConversationList(userId: string, userModel: 'User' | 'Owner'): Promise<any[]> {
    return this._messageRepository.getConversationList(userId, userModel);
  }
}