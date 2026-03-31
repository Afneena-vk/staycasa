
import { injectable, inject } from 'tsyringe';
import { IMessageService } from './interfaces/IMessageService';
import { IMessageRepository } from '../repositories/interfaces/IMessageRepository';
import { TOKENS } from '../config/tokens';
import { IMessage } from '../models/messageModel';
import { MessageMapper } from '../mappers/messageMapper';
import { MessageResponseDTO, ConversationListDTO } from '../dtos/message.dto';
import { AppError } from '../utils/AppError';
import { STATUS_CODES, MESSAGES } from '../utils/constants';
import mongoose from 'mongoose';

@injectable()
export class MessageService implements IMessageService {
  constructor(
    @inject(TOKENS.IMessageRepository) private _messageRepository: IMessageRepository
  ) {}

 // async getConversation(userId: string, ownerId: string, propertyId: string): Promise<IMessage[]> {
  async getConversation(userId: string, ownerId: string, propertyId: string): Promise<MessageResponseDTO[]> {
   // return this._messageRepository.getConversation(userId, ownerId, propertyId);

  const messages = await this._messageRepository.getConversation(
    userId,
    ownerId,
    propertyId
  );
   return messages.map(MessageMapper.toDTO);
  }

  async saveMessage(data: {
    sender: string;
    senderModel: 'User' | 'Owner';
    receiver: string;
    receiverModel: 'User' | 'Owner';
    propertyId: string;
    content?: string;
    image?: string;
  // }): Promise<IMessage> {
    }):Promise<MessageResponseDTO> {
      
     if (!data.content && !data.image) {
      //throw new AppError('Message must contain content or image', 400);
        throw new AppError(
          "Message must contain content or image",
          STATUS_CODES.BAD_REQUEST
      );

    }

    //const message = await this._messageRepository.create(data);
  const message = await this._messageRepository.saveMessage({
  sender: new mongoose.Types.ObjectId(data.sender),
  senderModel: data.senderModel,
  receiver: new mongoose.Types.ObjectId(data.receiver),
  receiverModel: data.receiverModel,
  propertyId: new mongoose.Types.ObjectId(data.propertyId),
  content: data.content,
  image: data.image,
});

    return MessageMapper.toDTO(message);

    
}

  async markAsRead(receiverId: string, senderId: string, propertyId: string): Promise<void> {
   
     await this._messageRepository.markAsRead(receiverId, senderId, propertyId);
  }

 
   async getConversationList(userId: string, userModel: 'User' | 'Owner'): Promise<ConversationListDTO[]> {
    return this._messageRepository.getConversationList(userId, userModel);
  }
}