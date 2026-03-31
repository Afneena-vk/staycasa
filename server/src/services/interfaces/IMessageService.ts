import { IMessage } from "../../models/messageModel";
import {
  MessageResponseDTO,
  ConversationListDTO,
} from "../../dtos/message.dto";

export interface IMessageService {
  getConversation(
    userId: string,
    ownerId: string,
    propertyId: string,
  ): Promise<MessageResponseDTO[]>;
  saveMessage(data: {
    sender: string;
    senderModel: "User" | "Owner";
    receiver: string;
    receiverModel: "User" | "Owner";
    propertyId: string;
    content?: string;
    image?: string;
  }): Promise<MessageResponseDTO>;
  markAsRead(
    receiverId: string,
    senderId: string,
    propertyId: string,
  ): Promise<void>;
  // getConversationList(userId: string, userModel: 'User' | 'Owner'): Promise<any[]>;
  getConversationList(
    userId: string,
    userModel: "User" | "Owner",
  ): Promise<ConversationListDTO[]>;
}
