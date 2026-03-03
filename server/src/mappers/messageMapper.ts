
import { IMessage } from '../models/messageModel';
import { MessageResponseDTO } from '../dtos/message.dto';

export class MessageMapper {
  static toDTO(message: IMessage): MessageResponseDTO {
    return {
      id: message._id.toString(),
      senderId: message.sender.toString(),
      senderModel: message.senderModel,
      receiverId: message.receiver.toString(),
      receiverModel: message.receiverModel,
      propertyId: message.propertyId.toString(),
      content: message.content,
      image: message.image ?? undefined,
      isRead: message.isRead,
      createdAt: message.createdAt,
    };
  }
}